/**
 * GitHub API utilities for fetching repository data at build time
 */

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  description: string;
}

interface RepoStats {
  stars: number;
  forks: number;
}

/**
 * Extract owner and repo name from a GitHub URL
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

/**
 * Fetch repository stats from GitHub API
 * Note: Unauthenticated requests are limited to 60/hour
 * For higher limits, set GITHUB_TOKEN environment variable
 */
export async function getRepoStats(githubUrl: string): Promise<RepoStats | null> {
  // Optional: disable GitHub API calls during build if needed
  if (import.meta.env.DISABLE_GITHUB_STATS === 'true') return null;

  // Set DEBUG_GITHUB=true to see GitHub API failures in build logs
  const debug = import.meta.env.DEBUG_GITHUB === 'true';

  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) return null;

  const { owner, repo } = parsed;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Vibhav-Portfolio',
    };

    // Use token if available for higher rate limits
    const token = import.meta.env.GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      // Don't fail the build if GitHub is rate-limiting or temporarily unavailable.
      if (debug) console.warn(`GitHub API error for ${owner}/${repo}: ${response.status}`);
      return null;
    }

    const data: GitHubRepo = await response.json();
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
    };
  } catch (error) {
    // Avoid noisy logs in local/offline builds.
    if (debug) console.warn(`Failed to fetch GitHub stats for ${owner}/${repo}`);
    return null;
  }
}

/**
 * Fetch stats for multiple repositories
 * Returns a map of GitHub URL -> stats
 */
export async function getMultipleRepoStats(
  githubUrls: string[]
): Promise<Map<string, RepoStats>> {
  const results = new Map<string, RepoStats>();

  // Fetch in parallel but handle failures gracefully
  const promises = githubUrls.map(async (url) => {
    const stats = await getRepoStats(url);
    if (stats) {
      results.set(url, stats);
    }
  });

  await Promise.all(promises);
  return results;
}

// Note: Organization/user aggregate stats were removed to keep the build simple.


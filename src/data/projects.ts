import { getRepoStats } from '../utils/github';

export type IconColor = 'coral' | 'teal' | 'orange' | 'blue';

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  iconColor: IconColor;
  tags: string[];
  stars?: number;
  forks?: number;
  href: string;
  githubUrl?: string;
}

// Project definitions without stats (will be enriched at build time)
const projectDefinitions: Record<string, Omit<Project, 'stars' | 'forks'>[]> = {
  featured: [
    {
      title: 'Password Manager',
      subtitle: 'Python • Security',
      description: 'Secure desktop password manager with AES-256-GCM encrypted vault, master-password auth, and secure clipboard handling with auto-clear.',
      iconColor: 'coral',
      tags: ['Python', 'AES-256-GCM', 'Crypto', 'Secure Storage'],
      href: 'https://github.com/VibhavChennamadhava/Password_manager',
      githubUrl: 'https://github.com/VibhavChennamadhava/Password_manager',
    },
    {
      title: 'HTB WriteUps',
      subtitle: 'Offensive Security',
      description: 'Structured Hack The Box writeups covering attack chain, evidence, privilege escalation, impact, and mitigations aligned to real SOC workflows.',
      iconColor: 'teal',
      tags: ['HTB', 'Recon', 'Exploitation', 'Reporting'],
      href: 'https://github.com/VibhavChennamadhava/HTBWriteUps',
      githubUrl: 'https://github.com/VibhavChennamadhava/HTBWriteUps',
    },
    {
      title: 'SMTP Mail Server Lab',
      subtitle: 'Email Security',
      description: 'Deployed iRedMail on Ubuntu with TLS (Let\'s Encrypt), DNS + rDNS, and SPF/DKIM/DMARC; validated real external email delivery and replies.',
      iconColor: 'orange',
      tags: ['Ubuntu', 'TLS', 'SPF/DKIM/DMARC', 'DNS'],
      href: 'https://github.com/VibhavChennamadhava/Designing-an-SMTP-Mail-Server-Using-iRedMail',
      githubUrl: 'https://github.com/VibhavChennamadhava/Designing-an-SMTP-Mail-Server-Using-iRedMail',
    },
    {
      title: 'Wazuh SIEM/EDR POC',
      subtitle: 'Detection & Triage',
      description: 'Built a Wazuh SIEM/EDR proof-of-concept with investigation flows: agent telemetry, alert triage, log correlation, and IOC-driven analysis to mirror incident response.',
      iconColor: 'blue',
      tags: ['Wazuh', 'SIEM', 'EDR', 'IR'],
      href: 'https://github.com/VibhavChennamadhava',
    },
    {
      title: 'Cloud Security Failure Patterns',
      subtitle: 'AWS • Azure • GCP',
      description: 'Practiced common cloud misconfiguration scenarios (IAM, storage exposure, network rules, missing logging) and prioritized fixes by blast radius and risk exposure.',
      iconColor: 'teal',
      tags: ['IAM', 'Hardening', 'Logging', 'Risk'],
      href: 'https://github.com/VibhavChennamadhava',
    },
  ],
  web: [],
  mobile: [],
  curated: [],
};

/**
 * Enrich project with GitHub stats
 */
async function enrichProject(project: Omit<Project, 'stars' | 'forks'>): Promise<Project> {
  const githubUrl = project.githubUrl || project.href;

  if (githubUrl?.includes('github.com')) {
    const stats = await getRepoStats(githubUrl);
    if (stats) {
      return { ...project, stars: stats.stars, forks: stats.forks };
    }
  }

  return project;
}

/**
 * Get all projects with GitHub stats (fetched at build time)
 */
export async function getProjects(): Promise<{
  featured: Project[];
  web: Project[];
  mobile: Project[];
  curated: Project[];
}> {
  const [featured, web, mobile, curated] = await Promise.all([
    Promise.all(projectDefinitions.featured.map(enrichProject)),
    Promise.all(projectDefinitions.web.map(enrichProject)),
    Promise.all(projectDefinitions.mobile.map(enrichProject)),
    Promise.all(projectDefinitions.curated.map(enrichProject)),
  ]);

  return { featured, web, mobile, curated };
}

/**
 * Get a subset of featured projects for the home page
 */
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const all = [
    ...projectDefinitions.featured,
  ];

  const enriched = await Promise.all(all.slice(0, limit).map(enrichProject));
  return enriched;
}

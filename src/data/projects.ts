import { getRepoStats } from '../utils/github';

export type IconColor = 'coral' | 'teal' | 'orange' | 'blue';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  title: string;
  subtitle: string;
  outcome: string;
  whatBuilt: string;
  techStack: string[];
  securityFocus: string;
  iconColor: IconColor;
  links: ProjectLink[];
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
      subtitle: 'Python • Application Security',
      outcome: 'Built an offline desktop vault with strong cryptography and safer clipboard handling to reduce password leakage risk.',
      whatBuilt: 'AES-256-GCM encrypted vault, master-password authentication, and auto-clear clipboard flow for sensitive fields.',
      techStack: ['Python', 'Cryptography', 'AES-256-GCM', 'Secure Storage'],
      securityFocus: 'Data-at-rest encryption, secret handling hygiene, and reducing credential exposure on endpoints.',
      iconColor: 'coral',
      links: [
        { label: 'Repository', href: 'https://github.com/VibhavChennamadhava/Password_manager' },
      ],
      href: 'https://github.com/VibhavChennamadhava/Password_manager',
      githubUrl: 'https://github.com/VibhavChennamadhava/Password_manager',
    },
    {
      title: 'HTB WriteUps',
      subtitle: 'Offensive Security',
      outcome: 'Documented end-to-end attack paths with evidence, impact, and mitigations to mirror SOC-ready reporting.',
      whatBuilt: 'Repeatable writeup format: recon → exploitation → privilege escalation → validation → remediation notes.',
      techStack: ['Linux', 'Recon', 'Exploitation', 'Reporting'],
      securityFocus: 'Threat-driven reporting, root-cause analysis, and practical mitigations for defenders.',
      iconColor: 'teal',
      links: [
        { label: 'Writeups', href: 'https://github.com/VibhavChennamadhava/HTBWriteUps' },
        { label: 'HTB Profile', href: 'https://app.hackthebox.com/users/1841858' },
      ],
      href: 'https://github.com/VibhavChennamadhava/HTBWriteUps',
      githubUrl: 'https://github.com/VibhavChennamadhava/HTBWriteUps',
    },
    {
      title: 'SMTP Mail Server Lab',
      subtitle: 'Email Security',
      outcome: 'Deployed a production-like mail server with authentication and DNS hardening to validate secure delivery and reputation.',
      whatBuilt: 'iRedMail on Ubuntu with TLS via Let’s Encrypt, DNS records, rDNS, and SPF/DKIM/DMARC alignment.',
      techStack: ['Ubuntu', 'iRedMail', 'TLS', 'DNS', 'SPF/DKIM/DMARC'],
      securityFocus: 'Email spoofing resistance, transport security, and domain reputation hygiene.',
      iconColor: 'orange',
      links: [
        { label: 'Lab Repo', href: 'https://github.com/VibhavChennamadhava/Designing-an-SMTP-Mail-Server-Using-iRedMail' },
      ],
      href: 'https://github.com/VibhavChennamadhava/Designing-an-SMTP-Mail-Server-Using-iRedMail',
      githubUrl: 'https://github.com/VibhavChennamadhava/Designing-an-SMTP-Mail-Server-Using-iRedMail',
    },
    {
      title: 'Wazuh SIEM/EDR POC',
      subtitle: 'Detection & Triage',
      outcome: 'Modeled triage workflows for endpoint telemetry to practice alert validation and escalation decisions.',
      whatBuilt: 'Agent telemetry collection, rule-based alerting, and investigation notes for IOC-driven analysis.',
      techStack: ['Wazuh', 'SIEM', 'EDR', 'Linux', 'Log Analysis'],
      securityFocus: 'Alert fidelity, log correlation, and incident response readiness.',
      iconColor: 'blue',
      links: [
        { label: 'Project Notes', href: 'https://github.com/VibhavChennamadhava' },
      ],
      href: 'https://github.com/VibhavChennamadhava',
    },
    {
      title: 'Cloud Security Failure Patterns',
      subtitle: 'AWS • Azure • GCP',
      outcome: 'Practiced common misconfigurations and prioritized fixes by exposure and blast radius.',
      whatBuilt: 'Hands-on scenarios for IAM, storage exposure, network rules, and missing logging with documented mitigations.',
      techStack: ['IAM', 'Cloud Logging', 'Network Security', 'Storage Security'],
      securityFocus: 'Least privilege, monitoring coverage, and remediation prioritization.',
      iconColor: 'teal',
      links: [
        { label: 'Lab Notes', href: 'https://github.com/VibhavChennamadhava' },
      ],
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
  const all = [...projectDefinitions.featured];

  const enriched = await Promise.all(all.slice(0, limit).map(enrichProject));
  return enriched;
}

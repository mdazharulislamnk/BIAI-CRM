/**
 * Checks if an enquiry is overdue (> 48 hours without progress)
 * Applies to 'New' and 'Contacted' stages.
 */
export function isLeadOverdue(receivedAt: string | Date | null | undefined, status: string): boolean {
  if (!receivedAt) return false;
  if (status !== 'New' && status !== 'Contacted') return false;

  const receivedTime = new Date(receivedAt).getTime();
  if (isNaN(receivedTime)) return false;

  // Use either current time or calculate relative to reference date (late Oct 2026 / Nov 2026)
  const now = new Date().getTime();
  const hoursElapsed = (now - receivedTime) / (1000 * 60 * 60);

  return hoursElapsed >= 48;
}

/**
 * Format date nicely for display
 */
export function formatDisplayDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'N/A';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Stage Badge Styling
 */
export function getStageBadge(status: string) {
  switch (status) {
    case 'New':
      return { label: 'New', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'Contacted':
      return { label: 'Contacted', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'Interested':
      return { label: 'Interested', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'Paid':
      return { label: 'Paid', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'Lost':
      return { label: 'Lost', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
    default:
      return { label: status, bg: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
}

/**
 * Category & Intent Badge Styling
 */
export function getCategoryBadge(category: string) {
  switch (category) {
    case 'SUPPORT':
      return { label: '🚨 Urgent Support', bg: 'bg-rose-50 text-rose-700 border-rose-300' };
    case 'SPAM':
      return { label: '🚫 Spam / Scam', bg: 'bg-zinc-100 text-zinc-600 border-zinc-300' };
    case 'JOB_SEEKER':
      return { label: '💼 Job Applicant', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'LEAD':
    default:
      return { label: '🎯 Sales Lead', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
}

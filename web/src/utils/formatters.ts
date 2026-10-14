export function formatCurrency(amount: number | undefined | null, showDecimals: boolean = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formatted = '';
  if (showDecimals) {
    formatted = absAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    formatted = Math.round(absAmount).toLocaleString('en-IN');
  }

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function maskAccountNumber(acc: string | undefined | null): string {
  if (!acc) return '•••• ••••';
  const clean = acc.replace(/\s+/g, '');
  if (clean.length <= 4) return `•••• ${clean}`;
  return `•••• •••• ${clean.slice(-4)}`;
}

export function maskCardNumber(card: string | undefined | null): string {
  if (!card) return '•••• ••••';
  const clean = card.replace(/[\s-]+/g, '');
  if (clean.length <= 4) return `•••• ${clean}`;
  return `•••• •••• •••• ${clean.slice(-4)}`;
}

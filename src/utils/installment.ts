/**
 * Retorna o texto formatado do parcelamento sem juros caso o produto tenha parcelamento configurado (> 1x).
 * Se maxInstallments for 0, 1, undefined ou null, retorna null (nenhum texto é exibido).
 */
export function getInstallmentText(price: number, maxInstallments?: number | null): string | null {
  if (!maxInstallments || maxInstallments <= 1) {
    return null;
  }
  const installmentValue = price / maxInstallments;
  const formattedValue = installmentValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `ou em até ${maxInstallments}x de R$ ${formattedValue} sem juros`;
}

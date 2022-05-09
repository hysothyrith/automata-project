export const createNode = (id: string) => ({ data: { id } });

export const createEdge = ({
  from,
  to,
  label,
}: {
  from: string;
  to: string;
  label?: string;
}) => ({
  data: {
    id: `${from}${to}`,
    source: from,
    target: to,
    label: label || "",
  },
});

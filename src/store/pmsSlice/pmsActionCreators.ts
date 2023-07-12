export const initializeToken = (pmsToken: string) => ({
  type: "@@proppu/pms/initializeToken" as const,
  payload: pmsToken,
});

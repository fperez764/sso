export const mapErrors = (errors: Object[]) => {
  return {
    errors: errors.reduce((prev, err: any) => {
      prev[err.property] = Object.entries(err.constraints)[0][1];
      return prev;
    }, {}),
  };
};

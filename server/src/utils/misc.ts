export const mapErrors = (errors: Object[]) => {
  return {
    errors: errors.reduce((prev, err: any) => {
      prev[err.property] = Object.entries(err.constraints)[0][1];
      return prev;
    }, {}),
  };
};

export function checkEmail(email: string) {
  var filter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  return filter.test(email);
}

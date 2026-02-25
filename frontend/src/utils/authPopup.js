export const EMPTY_POPUP = Object.freeze({
  open: false,
  type: "",
  title: "",
  message: ""
});

export const createPopup = (type, title, message) => ({
  open: true,
  type,
  title,
  message
});

export const getLoginPopupFromError = (error) => {
  const statusCode = error?.response?.status;
  const retryAfter = error?.response?.headers?.["retry-after"];
  const fallbackMessage = error?.response?.data?.message;

  let message = fallbackMessage || "Could not sign in right now. Please try again.";
  if (statusCode === 401) {
    message = "Invalid email or password.";
  } else if (statusCode === 429) {
    message = retryAfter
      ? `Too many attempts. Try again in ${retryAfter} seconds.`
      : "Too many attempts. Please wait and try again.";
  } else if (statusCode === 503) {
    message = "Sign-in service is unavailable right now.";
  }

  return createPopup("error", "Sign-in issue", message);
};

export const getRegistrationPopupFromError = (error) => {
  const statusCode = error?.response?.status;
  const fallbackMessage = error?.response?.data?.message;

  let message = fallbackMessage || "Could not create account right now. Please try again.";
  if (statusCode === 409) {
    message = "Email already registered.";
  } else if (statusCode === 503) {
    message = "Sign-up service is unavailable right now.";
  }

  return createPopup("error", "Sign-up issue", message);
};

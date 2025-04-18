export function validateMovieForm({
  userName,
  movieName,
  userEmail,
  movieRate,
}) {
  const errors = {};

  const requireValidation = (item) => {
    return item && item.trim().length > 0;
  };
  const rateValid =
    movieRate && !isNaN(movieRate) && movieRate >= 1 && movieRate <= 10;

  switch (true) {
    case !requireValidation(movieName):
      errors.movieName = "Movie name is required";

    case !requireValidation(userEmail):
      errors.userEmail = "User email is required";

    case !requireValidation(userName):
      errors.userName = "User name is required";

    case !rateValid:
      errors.movieRate = "Movie rate must be between 1 and 10";
      break;
  }

  return errors;
}

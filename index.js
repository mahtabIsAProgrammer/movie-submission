import fs from "fs";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { validateMovieForm } from "./handlers/validation.js";

const app = express();
const PORT = 3004;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  const { movieName, movieRate, userName, userEmail } = req.body;

  const errors = validateMovieForm(req.body);

  if (Object.keys(errors).length > 0) {
    res.render("index.ejs", { errors: errors || {}, ...req.body });
  } else {
    // create objects of submitted movies
    const newSubmission = {
      title: movieName,
      rating: movieRate,
      userName,
      userEmail,
    };

    // read the contnets of the txt file
    fs.readFile("data/submittedMovies.txt", "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading the text file:", err);
        return res.status(500).send("Internal Server Error");
      }
      // filters the emplty lines and convert them to array
      const submittedMovies = data
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

      // checking for movies dublication
      if (isDuplicate(submittedMovies, newSubmission.title)) {
        res.render("index.ejs", {
          errors: { movieName: "Movie already exists." },
        });
      } else {
        fs.appendFile(
          "data/submittedMovies.txt",
          JSON.stringify(newSubmission) + "\n",
          (err) => {
            if (err) {
              console.error("Error writing to the text file:", err);
              return res.status(500).send("Internal Server Error");
            }

            res.render("success.ejs", {
              movieName,
              movieRate,
              userEmail,
              userName,
              submittedMovies: [...submittedMovies, newSubmission],
            });
          }
        );
      }
    });
  }
});

function isDuplicate(submittedMovies, newTitle) {
  return submittedMovies.some(
    (rating) => rating.title.toLowerCase() === newTitle.toLowerCase()
  );
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

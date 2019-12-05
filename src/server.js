const Express = require("express");
const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("./models/user");

const app = Express();
// Connect to the 'test' database. Ensure you have started the mongod process!
const clientAppDirectory = path.join(__dirname, "../public", "build");
const uri =
    "mongodb+srv://webdev:paulmorton@cluster0-tibnr.mongodb.net/paul?retryWrites=true&w=majority";

Mongoose.connect(uri, { useNewUrlParser: true });

// When Mongoose has connected to your MongoDB, print out a log message
Mongoose.connection.once("open", () => console.log("Connected to database!"));

// We will use an Express Middleware called json. Middleware is called before any REST route gets your request.
// Middleware can reject requests prior to reaching your REST routes or append data to your route.
// The Express.json middleware provides easy to use JSON on POST requests.
app.use(Express.json());
app.use(Express.static(clientAppDirectory));

app.get("/*", (request, response) => {
    const indexPath = path.join(clientAppDirectory, "index.html");

    return response.sendFile(indexPath);
});

app.get("/api/users", async (request, response) => {
    console.log("A GET request came in asking for all users");

    const users = await User.find({});

    return response.send(users).status(200);
});

app.post("/api/users", async (request, response) => {
    // Pull the email and password out of the request body

    console.log("A Post request came in for users");
    const { email, password } = request.body;

    try {
        // Check if a user with that email already exists in the database
        const existingUser = await User.findOne({ email: { $eq: email } });

        // There already is a user with that email, don't tell the user this to mitigate user enumeration, just return a 400
        if (existingUser) {
            console.log(
                `A user with the email address '${email}' already exists, rejecting request with a 400`
            );

            return response.sendStatus(400);
        }

        // Hash the plaintext password with 12 salt rounds
        await bcrypt.hash(password, 12, async (error, hash) => {
            // Something went wrong (not common), return a 400
            if (error) {
                console.log("An error occured hashing the password: " + error.message);

                return response.sendStatus(400);
            }

            // Create a new user with the password hash and email address
            const user = await User.create({email, passwordDigest: hash});

            console.log(
                "Saved user email was " +
                user.email +
                " and passwordDigest was " +
                user.passwordDigest
            );

            return response.sendStatus(200);
        });
    } catch (error) {
        console.log("An unexpected error occured: " + error.message);

        return response.sendStatus(500);
    }
});

// This endpoint will be used to log in
app.post("/api/sessions", async (request, response) => {
    // Pull the login credentials from the request
    const { email, password } = request.body;

    // Find a user with the email address specified
    const user = await User.findOne({ email: { $eq: email } });

    // No user was found with that email address, dont tell the user this to mitigate user enumeration attacks, just return a 400
    if (!user) {
        console.log("No user was found with the email address: " + email);

        return response.sendStatus(400);
    }

    // Let Bcrypt figure out if the given plaintext password equals the one saved in the database
    // Bcrypt will handle the random salt it gave the password when the user was created
    bcrypt.compare(password, user.passwordDigest, (error, result) => {
        // Not common, return a 400 if there was an error
        if (error) {
            console.error(
                "There was an error checking the users password hash: " + error.message
            );

            return response.sendStatus(400);
        }

        // Don't perform truthy logic here, check strict against a boolean
        if (result === true) {
            console.log("User successfully logged in!");

            return response.sendStatus(200);
        }

        console.log("User failed login, incorrect password");

        return response.sendStatus(400);
    });
});
app.get("/*", (request, response) => {
    const indexPath = path.join(clientAppDirectory, "index.html");

    return response.sendFile(indexPath);
});

const port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port);
app.listen(port, () => console.log(`Server has started on localhost:${port}`));
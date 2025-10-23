const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public/index.html"));
});

// simple REST endpoints for demo
let bookings = [];

app.post("/api/book", (req, res) => {
	const { name, event } = req.body;
	if (!name || !event)
		return res.status(400).json({ error: "name and event required" });
	const id = bookings.length + 1;
	const booking = { id, name, event, createdAt: new Date().toISOString() };
	bookings.push(booking);
	return res.status(201).json(booking);
});

app.get("/api/bookings", (req, res) => {
	res.json(bookings);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Ticket app listening on ${port}`));

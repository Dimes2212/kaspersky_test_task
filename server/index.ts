import "dotenv/config";
import express from "express";
import cors from "cors";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE_PATH = path.join(__dirname, "data", "users.json");

app.use(cors({ origin: CORS_ORIGINS }));
app.use(express.json());

async function readUsersFile() {
  const fileContent = await readFile(USERS_FILE_PATH, "utf-8");
  return JSON.parse(fileContent);
}

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

app.get("/api/users", async (_, res) => {
  try {
    const users = await readUsersFile();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: `Failed to load users, ${error}` });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, account, email, group, phone, age } = req.body;

    if (!name || !account || !email || !phone || age === undefined) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const users = await readUsersFile();
    const nextId =
      users.length > 0
        ? Math.max(...users.map((user: { id: number }) => user.id)) + 1
        : 1;

    const newUser = {
      id: nextId,
      name,
      account,
      email,
      group: group || null,
      phone,
      age: Number(age),
    };

    const updatedUsers = [...users, newUser];
    await writeFile(USERS_FILE_PATH, JSON.stringify(updatedUsers, null, 2));

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: `Failed to create user, ${error}` });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isFinite(userId)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    const users = await readUsersFile();
    const hasUser = users.some((user: { id: number }) => user.id === userId);

    if (!hasUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedUsers = users.filter((user: { id: number }) => user.id !== userId);
    await writeFile(USERS_FILE_PATH, JSON.stringify(updatedUsers, null, 2));

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: `Failed to delete user, ${error}` });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

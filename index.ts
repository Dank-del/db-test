import { PrismaClient, User } from "@prisma/client";
import {faker} from "@faker-js/faker";
import fs from "fs";
import { User as SequelizeUser, sequelize } from "./sequelize";
const prisma = new PrismaClient();

const millionPeople: Partial<User>[] = [];
[...Array(100_000)].forEach(() => {
    millionPeople.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    });
});

async function main() {
    console.time("prisma-insert"); // Start the timer
    const prismaResult = await Promise.all(millionPeople.map(async (person) => {
        return await prisma.user.create({
            data: {
                name: person.name!,
                email: person.email!,
                password: person.password!,
            },
        });
        console.log(person);
        return person;
    }));
    console.timeEnd("prisma-insert"); // End the timer and log the time taken
    console.log("Writing results to disk...");
    fs.writeFileSync("./prisma-result.json", JSON.stringify(prismaResult, null, 2));
    await sequelize.sync({ force: true });
    console.time("sequelize-insert"); // Start the timer
    const sequelizeResult = await Promise.all(millionPeople.map(async (person) => {  
        return await SequelizeUser.create({
            name: person.name!,
            email: person.email!,
            password: person.password!,
        });
    }));
    console.timeEnd("sequelize-insert"); // End the timer and log the time taken
    console.log("Writing results to disk...");
    fs.writeFileSync("./sequelize-result.json", JSON.stringify(sequelizeResult, null, 2));
    console.log("Done!");
}

main();
import { createConsumer } from "@rails/actioncable";

export const consumer = createConsumer("ws://localhost:3000/cable");

import { setupCreators } from "#base";

export const { createCommand, createEvent, createResponder } = setupCreators();

setupCreators({
    commands: {
        verbose: true
    }
})
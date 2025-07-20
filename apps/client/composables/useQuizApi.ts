import type { APIResponse, ConnectionResponse, GameRequest, QuizDetail } from "~/types/quiz";

export const useQuizApi = () => {

    const baseUrl = 'http://localhost:3000/api';

    const fetchQuizzes = async () => {

        const { data } = await useFetch<APIResponse<QuizDetail[]>>(`${baseUrl}/quiz`);

        return data.value;
    };

    const createGame = async (quizID: string) => {

        const response = await $fetch<APIResponse<GameRequest>>(`${baseUrl}/game/create/${quizID}`, {
            method: 'POST',
        });


        return response;
    };

    const connectToGame = async (request: GameRequest, username: string) => {
        const response = await $fetch<APIResponse<ConnectionResponse>>(`${baseUrl}/game/connect/${request.joinCode}`, {
            method: 'POST',
            headers: {
                'x-access-code': request.accessCode,
            },
            body: {
                username: username
            }

        });

        return response;
    };

    const createAndConnectToGame = async (quizID: string, username: string) => {
        const gameRequest = await createGame(quizID);

        if (!gameRequest || !gameRequest.success) {
            throw new Error('Failed to create game');
        }

        const connectionResponse = await connectToGame(gameRequest.data, username);

        if (!connectionResponse || !connectionResponse.success) {
            throw new Error('Failed to connect to game');
        }

        return connectionResponse;
    };

    return {
        fetchQuizzes,
        createAndConnectToGame,
    };
}

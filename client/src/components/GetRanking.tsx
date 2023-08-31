import React, { useState } from "react";
import { fetchGetRanking } from "../services";


interface Ranking {
    ranking: {
        id:string;
        name: string;
        successRate: number;
    }[],
    average: number
}



export const GetRanking: React.FC = () => {
    const [getRanking, setRanking] = useState<Ranking | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetchGetRanking(token);

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                setRanking(responseData)
            } else {
                console.error("fetching ranking");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (



        <div className='bg-blue-200 rounded-lg m-4 p-4 max-h-96 overflow-y-auto'>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSubmit}
            >
                Ranking
            </button>
            {getRanking ? (
                <div>
                    {
                        <div >
                            <p>Average Success Rate: {getRanking.average}</p>
                        </div>
                    }
                    {getRanking.ranking.map((item, index) => (
                        <div key={item.id}>
                            <p>Name: {item.name}</p>
                            <p>Success Rate: {item.successRate}</p>
                        </div>
                    ))}
                </div>
            ) : (
                "Click the button to fetch ranking data"
            )}
        </div>
    )
}
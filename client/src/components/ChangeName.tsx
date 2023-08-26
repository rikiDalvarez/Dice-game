import React, {useState } from "react";
import { changeName } from "../services";

//   router.put("/players/:id", auth, playerRootControllers.changeName);

export type ChangeNameProps = {
  stateChanger: (param:boolean) => void
};

export const ChangeName: React.FC<ChangeNameProps> = (props) => {
  const [inputField, setInputValue] = useState("");
  const token = localStorage.getItem("token");
  const player_id = localStorage.getItem("id");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
		try {
			const response = await changeName(token,player_id, inputField);
			if (response.ok) {
				const data = await response.json();
				if (data.name === inputField){
                    console.log('Name changed succesfully')
                }else{
                console.error("Error ocurred during changing name")}
			} else {
				console.error(response)
			}
		} catch (error) {
			console.error("an error occurred:", error)
		}
        props.stateChanger(false)
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-color-movement">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <form className="form" onSubmit={handleSubmit}>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Introduce new name
          </label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            id="newName"
            onChange={(e) => handleInputChange(e)}
            required
          />

          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" 
          type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default ChangeName;

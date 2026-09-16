import React,{useState} from "react";
import {FiPlus, FiTrash2} from "react-icons/fi";
import apiClient from "../api/axios";

const CreatePoll= ({onPollCreated}) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);// Initializing with two empty options
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if(options.length < 5) {
            setOptions([...options, ""]);
        }
    };

    const removeOption = (index) => {
        if(options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (question.trim() === '') {
            setError('Please enter a question for the poll.');
            return;
        }
        const validOptions = options.filter(option => option.trim() !== '');
        if (validOptions.length < 2) {
            setError('Please enter at least two valid options.');
            return;
        }

        setSubmitting(true);
        try{
            const response = await apiClient.post('/polls', {
                question: question.trim(),
                options: validOptions
            });

            onPollCreated(response.data.data);
            setQuestion("");
            setOptions(["", ""]);
        }catch(err){
            setError(err.response?.data?.message || 'An error occurred while creating the poll.');
        }finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gray-800/60 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Create a New Poll</h2>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What would you like to ask?"
                    className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    rows="3"
                    maxLength="300"
                />
                <div className="mt-4 space-y-3">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="w-full p-2 bg-gray-900 rounded-md text-gray-200 border border-gray-600 focus:outline-none focus:border-purple-400"
                                maxLength="100"
                            />
                            {options.length > 2 && (
                                <button type="button" onClick={() => removeOption(index)} className="p-2 text-gray-400 hover:text-red-500">
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addOption} className="mt-3 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
                    <FiPlus /> Add Option
                </button>
                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                    >
                        {submitting ? 'Posting...' : 'Post Poll'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </form>
        </div>
    );
}

export default CreatePoll;
import React, { useState } from "react";

function ProfileCard({ userData, onUpdate }) {
    const [updatedData, setUpdatedData] = useState({});
    const [updatedImageData, setUpdatedImageData] = useState({});

    
    let trimmedPath = userData.image ? userData.image.replace("../client/public", "") : "";
    let plain = "/images/default.jpg"
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value || '',
        }));
    };

    
    const handleImageChange = (e) => {
        e.preventDefault();
        const imageFile = e.target.files[0];

        const formData = new FormData();
        formData.append('image', imageFile)
        setUpdatedImageData((prevData) => formData)
    };

    const postImage = (userData, formData) => {
        fetch(`http://127.0.0.1:5555/workers/${userData.id}`, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            
            console.log(formData);
            alert('Image Updated successfull!');
        })
        .catch(error => {
            console.error('Error updating profile:', error);
        });
    };



    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (let key in updatedData) {
            formData.append(key, updatedData[key]);

        }
        
        onUpdate(updatedData);
        postImage(userData,updatedImageData);
        console.log(e.target);
    };

    return (
        <>
            <div className="row ms-5 mx-auto" id={userData.id}>
                <div
                    id={userData.id}
                    className="col bg-light mt-5 mb-5 border border-secondary rounded"
                    style={{ width: "1000px", height: "900px" }}
                >
                    <form onSubmit={handleUpdate}>
                        <div className="mt-2" id={userData.id}>
                            <label htmlFor="profileImage">Profile Picture:</label>
                            <div className="mt-2 mb-2 " id={userData.id} ><img className="border border-secondary rounded" id={userData.id} src={trimmedPath? trimmedPath:plain } style={{ height: "400px" }}></img></div>
                            <input
                                type="file"
                                id="profileImage"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="mt-2" id={userData.id}>
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="first_name"
                                className="form-control"
                                value={updatedData.first_name !== undefined ? updatedData.first_name : userData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-2" id={userData.id}>
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="last_name"
                                className="form-control"
                                value={updatedData.last_name !== undefined ? updatedData.last_name : userData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-2" id={userData.id}>
                            <label htmlFor="bio">Bio:</label>
                            <textarea
                                id="bio"
                                name="about"
                                className="form-control"
                                value={updatedData.about !== undefined ? updatedData.about : userData.about}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-2" id={userData.id}>
                            <label htmlFor="location">Location:</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                className="form-control"
                                value={updatedData.location !== undefined ? updatedData.location : userData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-2" id={userData.id}>
                            <label htmlFor="phone">Phone:</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="form-control"
                                value={updatedData.phone !== undefined ? updatedData.phone : userData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-2" id={userData.id}>
                            <button type="submit" className="btn btn-primary">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ProfileCard;

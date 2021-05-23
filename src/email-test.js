import React from 'react';
import { Button } from 'react-bootstrap';

export const EmailTest = () => {

    const onSubmit = () => {
        console.log("hello");
        window.Email.send({
            SecureToken: "b7984caf-9777-4117-a62a-300814cdd60e",
            Host : "smtp.elasticemail.com",
            Username : "proiectdaw2021@gmail.com",
            Password : "83429559C55A73A820EF058BB3F6B3414E8C",
            To : "proiectdaw2021@gmail.com",
            From : "me.marc.andrei@gmail.com",
            Subject : "This is the subject",
            Body : "And this is the body"
          }).then(
              message => alert(message))
    };

    return (
    <div>
        <Button onClick={onSubmit}>Send</Button>
        
    </div>
    );

}
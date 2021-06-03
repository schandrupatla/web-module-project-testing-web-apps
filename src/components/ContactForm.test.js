import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

//1. the component renders the contact form component without errors.
test('renders without errors', ()=>{
    render(<ContactForm />)
    
});
//2.the header h1 element exists. Include three asserts, 
//if the header is in the document, if the heads is truthy, if the header has the correct test content.
test('renders the contact form header', ()=> {
    render(<ContactForm />);
    const header = screen.queryByText(/contact form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);

});

//3.the component renders ONE error message if the user enters less than 4 characters into the firstname field. Make sure to use async / await and the correct screen method to account for state change.

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
     const firstName = screen.getByLabelText("First Name*");
    // const firstName = screen.getByLabelText(/First Name/i);
    userEvent.type(firstName, "Sri");

    const button = screen.getByRole("button");
    userEvent.click(button);
    await waitFor(()=>{
        const fNameError = screen.queryByText(/Error: firstName must have at least 5 characters./i);
        expect(fNameError).toBeInTheDocument();
    })
});

//4.the component renders THREE error messages if the user submits without filling in any values.
test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const button = screen.getByRole("button");
    userEvent.click(button);

    // await waitFor(()=>{
    //     const fNameError = screen.queryByText(/Error: firstName must have at least 5 characters./i);
    //     expect(fNameError).toBeInTheDocument();
    //     const lNameError = screen.queryByText(/Error: lastName is a required field/i);
    //     expect(lNameError).toBeInTheDocument();
    //     const email = screen.queryByText(/Error: email must be a valid email address/i);
    //     expect(email).toBeInTheDocument();
    // });
    //or
    const errors = screen.getAllByTestId("error");
    expect(errors).toHaveLength(3);

});

//5.the component renders ONE error message if the user submits without filling in the email field.
test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const firstName = screen.getByLabelText("First Name*");
    userEvent.type(firstName, "sridevi")
    expect(firstName).toBeInTheDocument();

    const lastName = screen.getByLabelText("Last Name*");
    userEvent.type(lastName, "chandrupatla")
    expect(lastName).toBeInTheDocument();

    const email = screen.getByLabelText("Email*");
    expect(email).toBeEmpty();

    const button = screen.getByRole("button");
    userEvent.click(button);
    await waitFor(()=>{
        const email =screen.queryByText(/Error: email must be a valid email address/i)
        expect(email).toBeInTheDocument();
    })
});

//6.the component renders the text *"email must be a valid email address"* if an invalid email address is typed into the email field.

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const email = screen.getByLabelText("Email*");
    userEvent.type(email, "chandrupatla");
    const button = screen.getByRole("button");
    userEvent.click(button);
    await waitFor(()=>{
        const email =screen.queryByText(/Error: email must be a valid email address/i)
        expect(email).toBeInTheDocument();
    })

});

//7.the component renders the text *"lastName is a required field"* the form is submitted without a last name.

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const lNameInput = screen.getByLabelText(/Last Name/i);
    expect(lNameInput).toBeEmpty();
    const button = screen.getByRole("button");
    userEvent.click(button);
    waitFor(async () => {
      const lNameError = screen.queryByText(
        /Error: lastName is a required field./i
      );
      expect(lNameError).toBeInTheDocument();
    });
    
});

//8. the component renders the firstname, lastname and email text when submitted with valued fields and does **not** render a message value when one is not entered into the message field.
test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

  const fNameInput = screen.getByLabelText(/First Name/i);
  userEvent.type(fNameInput, "Sridevi");
  expect(fNameInput).toBeInTheDocument();
  const lNameInput = screen.getByLabelText(/Last Name/i);
  userEvent.type(lNameInput, "Chandrupatla");
  expect(lNameInput).toBeInTheDocument();
  const email = screen.getByLabelText(/Email/i);
  userEvent.type(email, "sriluanil@yahoo.com");
  expect(email).toBeInTheDocument();

  const button = screen.getByRole("button");
  userEvent.click(button);

  await waitFor(async () => {
    const fname = screen.getByTestId(/firstnameDisplay/i);
    const lName = screen.getByTestId(/lastnameDisplay/i);
    const msgEmail = screen.getByTestId(/emailDisplay/i);
    const msgBox = screen.queryByTestId(/messageDisplay/i);//returns null value

    expect(fname).toBeInTheDocument();
    expect(lName).toBeInTheDocument();
    expect(msgEmail).toBeInTheDocument();
    expect(msgBox).toBeNull();
  });
    
});

//9. renders all fields when the user submits with valid text filled in for all fields.
test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
  const fNameSelected = "Sridevi";
  const lNameSelected = "Chandrupatla";
  const emailSelected = "sriluanil@yahoo.com";
  const msgSelected = "Hello World!";


  const fNameInput = screen.getByLabelText(/First Name/i);
  userEvent.type(fNameInput, fNameSelected);
  expect(fNameInput).toBeInTheDocument();

  const lNameInput = screen.getByLabelText(/Last Name/i);
  userEvent.type(lNameInput, lNameSelected);
  expect(lNameInput).toBeInTheDocument();

  const email = screen.getByLabelText(/Email/i);
  userEvent.type(email, emailSelected);
  expect(email).toBeInTheDocument();

  const msg = screen.getByLabelText(/Message/i);
  userEvent.type(msg, msgSelected);
  expect(msg).toBeInTheDocument();

  const button = screen.getByRole("button");
  userEvent.click(button);

  waitFor(async () => {
    const fname = screen.getByTestId(/firstnameDisplay/i);
    const lName = screen.getByTestId(/lastnameDisplay/i);
    const msgEmail = screen.getByTestId(/emailDisplay/i);
    const msgBox = screen.getByTestId(/messageDisplay/i);

    expect(fname).toBeInTheDocument();
    expect(lName).toBeInTheDocument();
    expect(msgEmail).toBeInTheDocument();
    expect(msgBox).toBeInTheDocument();
  });
    
});
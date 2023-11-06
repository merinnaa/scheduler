/*We are rendering `<Application />` down below, so we need React.createElement
*/
import React from "react";

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import { render } from "@testing-library/react";

/*
  We import the component that we are testing
*/
import Application from "components/Application";

/*
  A test that renders a React Component
*/
describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {

    //create fucntion 'getByText' to query and interact with elements rendered in the component
    const { getByText } = render(<Application />);

    // ensuring that the "Monday" element is present in the rendered component before proceeding with the test.
    // use 'waitForElement' func to wait until "Monday" element is available, once avaialbel continues
    await waitForElement(() => getByText("Monday"));

    //click event on the element"Tuesday", used to change the selected day from Monday to Tuesday in appointment schedule
    fireEvent.click(getByText("Tuesday"));

    //assertion - checks whether an element with text'Leopold Silvers' is present in the component after click event
    // If it's - it'll pass otherwise -it'll fail
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    // Render the Application.
    const { container, debug } = render(<Application />);

    //Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    /* Use the getAllByTestId query, search for all of the appointments in the container.
     * Store the returned value locally in the test and use prettyDOM to print it.
    */
    const appointments = getAllByTestId(container, "appointment");

    //first element in the appointments array
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    //Verify the appointment element contains the text "Saving" immediately after "Save" button is clicked
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    //use built-in Array.prototype.find method to find specific day node that contains text "Monday"
    const dayNode = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(dayNode, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

   // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"))
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const dayNode = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
      );
    expect(getByText(dayNode, "2 spots remaining")).toBeInTheDocument();

});

  it("loads data, edits an interview, and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment (Archie Cohen).
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Edit the student name (e.g., change "Archie Cohen" to "Edited Student").
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Edited Student" }
    });

    // 5. Edit or select a different interviewer if needed.
    // For example, you can change the interviewer by clicking an alternative one.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button to save the changes.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element contains the text "Saving" immediately after clicking "Save."
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait until the element with the text "Edited Student" is displayed.
    await waitForElement(() => getByText(appointment, "Edited Student"));
    // 9. Check that the DayListItem with the text "Monday" still has the text "no spots remaining."
    const dayNode = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(dayNode, "1 spot remaining")).toBeInTheDocument();
  });

  /* test number five */
it("shows the save error when failing to save an appointment", () => {
  axios.put.mockRejectedValueOnce();
});

/* test number six */
it("shows the delete error when failing to delete an existing appointment", () => {
  axios.delete.mockRejectedValueOnce();
});
});
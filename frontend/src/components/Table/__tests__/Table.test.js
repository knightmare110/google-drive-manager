import React from "react";
import { render, screen } from "@testing-library/react";
import Table from "../"; // Adjust the path as necessary

describe("Table Component", () => {
  const columns = {
    name: "Name",
    age: "Age",
    city: "City",
  };

  const data = [
    { name: "John", age: 28, city: "New York" },
    { name: "Jane", age: 32, city: "Los Angeles" },
  ];

  it("renders table headers correctly", () => {
    render(<Table columns={columns} data={[]} />);

    // Check if all column headers are rendered
    Object.values(columns).forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("renders table rows correctly", () => {
    render(<Table columns={columns} data={data} />);

    // Check if each cell data is rendered
    data.forEach((row) => {
      Object.values(row).forEach((cellData) => {
        expect(screen.getByText(cellData)).toBeInTheDocument();
      });
    });
  });

  it("renders row actions if provided", () => {
    const renderRowActions = (row) => <button>Action for {row.name}</button>;

    render(
      <Table
        columns={columns}
        data={data}
        renderRowActions={renderRowActions}
      />
    );

    // Check if action buttons are rendered for each row
    data.forEach((row) => {
      expect(screen.getByText(`Action for ${row.name}`)).toBeInTheDocument();
    });
  });

  it("renders an empty table when no data is provided", () => {
    render(<Table columns={columns} data={[]} />);

    // Expect no data rows, just headers
    expect(screen.queryAllByRole("row")).toHaveLength(1); // Only header row should be present
  });
});

import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
const StickyHeadTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editableRows, setEditableRows] = useState(new Set());
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectAll = (event) => {
    const selected = event.target.checked;
    setEditableRows(new Set());
    setSelectedRows(selected ? rows.map((row) => row.id) : []);
  };

  function deleteUser(selectedUser) {
    toast.warning("User Deleted !", {
      position: toast.POSITION.TOP_RIGHT,
    });
    let userAfterDeletion = rows.filter((user) => {
      return user.id !== selectedUser;
    });
    setRows(userAfterDeletion);
  }

  const handleSelectRow = (event, rowId) => {
    // Check if the clicked element is the checkbox
    if (event.target.type === "checkbox") {
      const selectedIndex = selectedRows.indexOf(rowId);
      let newSelectedRows = [];

      if (selectedIndex === -1) {
        newSelectedRows = newSelectedRows.concat(selectedRows, rowId);
      } else if (selectedIndex === 0) {
        newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
      } else if (selectedIndex === selectedRows.length - 1) {
        newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelectedRows = newSelectedRows.concat(
          selectedRows.slice(0, selectedIndex),
          selectedRows.slice(selectedIndex + 1)
        );
      }

      setSelectedRows(newSelectedRows);
    }
  };

  const handleEditUser = (id) => {
    setEditableRows(new Set([id]));
  };

  const handleSaveChanges = () => {
    toast.success("Changes saved successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    setEditableRows(new Set());
  };

  const handleCancelEdit = () => {
    setEditableRows(new Set());
  };

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          name="name"
          placeholder="Search by any field"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="search-input"
        />
      </div>

      {editableRows.size > 0 && (
        <div className="btn-container1">
          <button className="cancel-btn" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      )}

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={editableRows.size > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .filter((user) => {
                  if (searchUser === "") return user;
                  else if (
                    user.name.includes(searchUser) ||
                    user.email.includes(searchUser) ||
                    user.role.includes(searchUser)
                  ) {
                    return user;
                  }
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isSelected = selectedRows.indexOf(row.id) !== -1;
                  const isEditable = editableRows.has(row.id);

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                      selected={isSelected}
                      onClick={(event) => handleSelectRow(event, row.id)}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                        />
                      </TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>
                        {isEditable ? (
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => {
                              setRows((prevRows) =>
                                prevRows.map((prevRow) =>
                                  prevRow.id === row.id
                                    ? { ...prevRow, name: e.target.value }
                                    : prevRow
                                )
                              );
                            }}
                          />
                        ) : (
                          row.name
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditable ? (
                          <input
                            type="text"
                            value={row.email}
                            onChange={(e) => {
                              setRows((prevRows) =>
                                prevRows.map((prevRow) =>
                                  prevRow.id === row.id
                                    ? { ...prevRow, email: e.target.value }
                                    : prevRow
                                )
                              );
                            }}
                          />
                        ) : (
                          row.email
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditable ? (
                          <input
                            type="text"
                            value={row.role}
                            onChange={(e) => {
                              setRows((prevRows) =>
                                prevRows.map((prevRow) =>
                                  prevRow.id === row.id
                                    ? { ...prevRow, role: e.target.value }
                                    : prevRow
                                )
                              );
                            }}
                          />
                        ) : (
                          row.role
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="btn-container">
                          {isEditable ? (
                            <button
                              className="save-btn"
                              onClick={handleSaveChanges}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="edit-btn"
                              onClick={() => handleEditUser(row.id)}
                            >
                              <AiFillEdit />
                            </button>
                          )}
                          <button
                            className="delete-btn"
                            onClick={() => deleteUser(row.id)}
                          >
                            <AiFillDelete />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ToastContainer />
    </>
  );
};

export default StickyHeadTable;

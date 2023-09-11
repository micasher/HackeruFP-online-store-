import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Typography,
  Divider,
  Container,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import ROUTES from "../routes/ROUTES";
import { useNavigate } from "react-router-dom";
import makeALegitStringForImage from "../utils/makeLegitStringForImage";

const CRMPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const [cards, setCards] = useState(null);
  const [showUsersCRM, setShowUsersCRM] = useState(true); // Set to true for showing users CRM, false for items CRM

  useEffect(() => {
    axios
      .get("users/users/")
      .then(({ data }) => {
        setUsers(data);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      });
    axios
      .get("cards/cards/")
      .then(({ data }) => {
        setCards(data);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      });
  }, []);

  const handleDeleteUser = (ev) => {
    axios
      .delete(`users/user/` + ev.target.id)
      .then(() => {
        setUsers(users.filter((user) => user._id !== ev.target.id));
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      });
  };
  const handleDeleteItem = (ev) => {
    axios
      .delete(`cards/card/` + ev.target.id)
      .then(() => {
        setCards(cards.filter((user) => user._id !== ev.target.id));
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      });
  };

  const handleEditUser = async (ev) => {
    try {
      let newUsersArr = JSON.parse(JSON.stringify(users));
      let currentUser = newUsersArr.find((user) => user._id === ev.target.id);
      let { data } = await axios.patch("/users/users/" + currentUser._id);
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          currentUser[key] = data[key];
        }
      }
      setUsers(newUsersArr);
    } catch (err) {
      if (err && err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("something went wrong, try again later please!");
      }
    }
  };
  const handleEditItem = (ev) => {
    if (ev && !ev.target) {
      return;
    }
    navigate(`${ROUTES.EDITCARD}/${ev.target.id}`);
  };

  const whenUserClicked = (ev) => {
    navigate(`${ROUTES.PROFILECRM}/${ev.target.id}`);
  };
  const whenItemClicked = (ev) => {
    if (ev && !ev.target) {
      return;
    }
    navigate(`${ROUTES.CARDDATA}/${ev.target.id}`);
  };

  const toggleCRMView = () => {
    setShowUsersCRM(!showUsersCRM);
  };

  return (
    <div>
      <Typography variant="h2" color="primary" align="center">
        CRM Admin Panel
      </Typography>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <Button variant="contained" color="primary" onClick={toggleCRMView}>
          {showUsersCRM ? "Manage Items" : "Manage Users"}
        </Button>
      </div>
      {showUsersCRM ? (
        <Container maxWidth="lg">
          <Typography variant="h6" color="primary">
            Streamlined Data Management: Users & Items Effortlessly manage user
            accounts and inventory items with just a click. Edit and delete
            information in the tables for maximum efficiency. Take control now!
          </Typography>
          <br />
          <Divider />
          <Typography component="h2" variant="h3" color="light">
            Users Table
          </Typography>
          <br />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users && users.length ? (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user._id}</TableCell>
                      <TableCell>
                        {`${user && user.name && user.name.first}
                          ${user && user.name && user.name.last}`}
                      </TableCell>
                      <TableCell>
                        <Avatar
                          src={makeALegitStringForImage(user, "user")}
                          alt={`X Profile picture of ${
                            user && user.name && user.name.first
                          }`}
                        />
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.isAdmin ? "admin" : "not admin"}
                      </TableCell>
                      <TableCell>
                        <Button
                          id={user._id}
                          variant="contained"
                          color="primary"
                          onClick={handleEditUser}
                        >
                          make {user.isAdmin ? "non-admin" : "admin"}
                        </Button>
                        <Button
                          id={user._id}
                          variant="contained"
                          color="secondary"
                          onClick={handleDeleteUser}
                        >
                          Delete
                        </Button>
                        <Button
                          id={user._id}
                          variant="contained"
                          color="secondary"
                          onClick={whenUserClicked}
                        >
                          Show more details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>No users found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      ) : (
        /* Here you can render the items CRM content */
        <Container maxWidth="lg">
          <Typography variant="h6" color="primary">
            Streamlined Data Management: Users & Items Effortlessly manage user
            accounts and inventory items with just a click. Edit and delete
            information in the tables for maximum efficiency. Take control now!
          </Typography>
          <br />
          <Divider />
          <Typography component="h2" variant="h3" color="light">
            Cards Table
          </Typography>
          <br />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>In Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cards && cards.length ? (
                  cards.map((card) => (
                    <TableRow key={card._id}>
                      <TableCell>{card._id}</TableCell>
                      <TableCell>{card && card.title}</TableCell>
                      <TableCell>
                        <img
                          style={{ width: "8vw", maxWidth: "90px" }}
                          src={makeALegitStringForImage(card, "card")}
                          alt={`${card && card.name && card.name.first}`}
                        />
                      </TableCell>
                      <TableCell>
                        {card.price ? `$${card.price}` : "Free"}
                      </TableCell>
                      <TableCell>
                        {card.stock ? `${card.stock}` : "Out of stock!"}
                      </TableCell>
                      <TableCell>
                        <Button
                          id={card._id}
                          variant="contained"
                          color="primary"
                          onClick={handleEditItem}
                        >
                          Edit
                        </Button>
                        <Button
                          id={card._id}
                          variant="contained"
                          color="secondary"
                          onClick={handleDeleteItem}
                        >
                          Delete
                        </Button>
                        <Button
                          id={card._id}
                          variant="contained"
                          color="secondary"
                          onClick={whenItemClicked}
                        >
                          Show more details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>No cards found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}
    </div>
  );
};

export default CRMPage;

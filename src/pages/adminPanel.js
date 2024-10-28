import React, { useEffect, useState } from 'react';
import { Card, Text, Button, Table, Switch, Badge } from "@nextui-org/react";
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [creditCards, setCreditCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('/api/v1/admin/users');
        setUsers(usersResponse.data);

        const commentsResponse = await axios.get('/api/v1/admin/comments');
        setComments(commentsResponse.data);

        const creditCardsResponse = await axios.get('/api/v1/admin/credit-cards');
        setCreditCards(creditCardsResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-panel">
      <Card>
        <Text h2>Admin Panel</Text>
      </Card>

      <Card>
        <Text h3>Users</Text>
        <Table>
          <Table.Header>
            <Table.Column>Username</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {users.map(user => (
              <Table.Row key={user._id}>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>
                  <Button size="small">Edit</Button>
                  <Button size="small" color="error">Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Card>
        <Text h3>Latest Comments</Text>
        <Table>
          <Table.Header>
            <Table.Column>Comment</Table.Column>
            <Table.Column>User</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {comments.map(comment => (
              <Table.Row key={comment._id}>
                <Table.Cell>{comment.content}</Table.Cell>
                <Table.Cell>{comment.userId}</Table.Cell>
                <Table.Cell>{new Date(comment.createdAt).toLocaleString()}</Table.Cell>
                <Table.Cell>
                  <Button size="small" color="error">Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Card>
        <Text h3>Credit Cards</Text>
        <Table>
          <Table.Header>
            <Table.Column>Card Name</Table.Column>
            <Table.Column>Bank Name</Table.Column>
            <Table.Column>Rating</Table.Column>
            <Table.Column>Review Count</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {creditCards.map(card => (
              <Table.Row key={card._id}>
                <Table.Cell>{card.cardName}</Table.Cell>
                <Table.Cell>{card.bankName}</Table.Cell>
                <Table.Cell>{card.bayesianRating}</Table.Cell>
                <Table.Cell>{card.reviewCount}</Table.Cell>
                <Table.Cell>
                  <Button size="small">Edit</Button>
                  <Button size="small" color="error">Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default AdminPanel;

import React from "react";
import { Card, Text, Row, Col, Rating } from "@heroui/react";

export default function CreditCardReviews() {
  const reviews = [
    {
      name: "John Doe",
      rating: 4,
      comment:
        "Great cashback rewards and no annual fee. Highly recommended for everyday spending!",
      tags: ["cashback", "no annual fee"],
    },
    {
      name: "Emily Smith",
      rating: 3,
      comment:
        "Great for travel rewards, but the annual fee is steep. Consider if you travel frequently.",
      tags: ["travel", "expensive"],
    },
  ];

  return (
    <Card css={{ mw: "420px" }}>
      <Card.Header>
        <Text b>Latest Credit Card Reviews</Text>
      </Card.Header>
      <Card.Body>
        {reviews.map((review, index) => (
          <Card key={index} variant="bordered" css={{ mb: "$6" }}>
            <Card.Body>
              <Row justify="space-between" align="center">
                <Col>
                  <Text b>{review.name}</Text>
                  <Rating value={review.rating} readOnly />
                </Col>
                <Col>
                  <Row>
                    {review.tags.map((tag, tagIndex) => (
                      <Col key={tagIndex} css={{ mr: "$2" }}>
                        <Text small color="$accents7">
                          {tag}
                        </Text>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
              <Text css={{ mt: "$4" }}>{review.comment}</Text>
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
}

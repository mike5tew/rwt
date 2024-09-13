//  This page lists the notices for upcoming events and other important information.  It gets this information from a Notices.json file in the public folder.
import * as React from 'react';
//import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Button } from 'reactstrap';



    export default function Notices() {
        interface NoticeItem {
            title: string;
            text: string;
            images: string[];
            date: string;
            }

        const [notices, setNotices] = React.useState([] as NoticeItem[]);

        React.useEffect(() => {
            async function getNotices() {
                try {
                    const response = await fetch('notices.json');
                    const data = await response.json();
                    return data;
                } catch (error) {
                    return console.error(error);
                }
            }
        
        getNotices().then(data => setNotices(data));
    }, []);
// the project is not running stating that TypeError: Cannot read properties of null (reading 'useState')
// the code is not working because the useState is not imported from react.  It is imported from react though
//  this means that the problem must be 


    return (
        <Container>
            <Row>
                {notices.map((notice: NoticeItem, index: number) => (
                    <Col key={index} sm="12" md="6" lg="4">
                        <Card>
                            <CardBody>
                                <CardTitle>{notice.title}</CardTitle>
                                <CardText>{notice.text}</CardText>
                                <Button tag={Link} to="/notices">Read More</Button>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
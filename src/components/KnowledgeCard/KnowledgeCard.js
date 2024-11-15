import React from 'react';
import {
    CardBody,
    Card,
    CardTitle,
} from 'reactstrap'

export default function KnowledgeCard({ image, title, description}) {
    return (
        <>
            <Card>
                <img
                    alt="Card cap"
                    src={image}
                    width="100%"
                />
                <CardBody>
                    <CardTitle tag="h5">
                        {title}
                    </CardTitle>
                </CardBody>
            </Card>
        </>
    )
}
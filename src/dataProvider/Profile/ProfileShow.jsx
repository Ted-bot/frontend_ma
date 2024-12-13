import * as React from 'react'
import {  Show, SimpleShowLayout, TextField, ArrayField } from 'react-admin'
import { SubscribedTo } from '../ListProvider/SubscribeTo'

const ProfileShow = () => (
        <Show>
            <SimpleShowLayout>
                <TextField source={"id"} />
                <TextField source={"username"} />
                {/* <TextField source={"websiteUrl"} /> */}
                <TextField labe="tokens" source={"tokens"} />
                <TextField source={"description"} />
                <ArrayField source="subscribeToEvents" label="Signed up for classes">
                    <SubscribedTo />
                </ArrayField>
            </SimpleShowLayout>
        </Show>
)


export default ProfileShow
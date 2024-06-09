import { List, Datagrid, TextField, DateField } from 'react-admin'
// import { List, Datagrid, TextField } from 'react-admin'

// export const UserList = () => (
//     <List>
//         <Datagrid>
//             <TextField source="id" />
//             <TextField source="userId" />
//             <TextField source="title" />
//             <TextField source="body" />
//         </Datagrid>
//     </List>
// );

export const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <TextField source="email" />
            <TextField source="password" />
            <TextField source="phoneNumber" />
            <DateField source="dateOfBirth" />
            <TextField source="gender" />
            <DateField source="createdAt" />
            <TextField source="conversion" />
        </Datagrid>
    </List>
);
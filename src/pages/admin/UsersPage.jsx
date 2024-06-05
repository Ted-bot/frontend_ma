// import {useState} from 'react'
// import { useQuery } from "react-query"

// eslint-disable-next-line react/prop-types
const UsersPage = ({list}) => {
    // const [open, setOpen] = useState(false);
  
    // TEST THE API
  
    // const { isLoading, data } = useQuery({
    //   queryKey: ["allUsers"],
    //   queryFn: () =>
    //     fetch("http://localhost:80/api/users/jsonld").then(
    //       (res) => res.json()
    //     ),
    // });

    console.log({list:list})
  
    return (
      <div className="users">
        <div className="info">
          <h1>Users</h1>
          <button >Add New Users</button>
          {/* <button onClick={() => setOpen(true)}>Add New Users</button> */}
        </div>
        {list}
        {/* <DataTable slug="products" columns={columns} rows={products} /> */}
        {/* TEST THE API */}
  
        {/* {isLoading ? (
          "Loading..."
        ) : (
          <DataTable slug="products" columns={columns} rows={data} />
        )}
        {open && <Add slug="product" columns={columns} setOpen={setOpen} />} */}
      </div>
    );
  };

  export default UsersPage
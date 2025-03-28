import SearchUser from "@/components/chat/SearchUser";
import Chat from "@/components/chat/Chat";
import { useState } from "react";

const Bazm = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div>
      <SearchUser onSelectUser={setSelectedUser} />
      {selectedUser && <Chat selectedUser={selectedUser} />}
    </div>
  );
};

export default Bazm;

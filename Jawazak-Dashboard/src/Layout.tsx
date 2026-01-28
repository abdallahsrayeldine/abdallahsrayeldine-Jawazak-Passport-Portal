import { Layout as RALayout, CheckForApplicationUpdate, AppBar } from "react-admin";
import MyMenu from './MyMenu';

const MyAppBar = (props: any) => <AppBar {...props} />;

export default function Layout(props: any) {
  return (
    <RALayout {...props} menu={MyMenu} appBar={MyAppBar}>
      {props.children}
      <CheckForApplicationUpdate />
    </RALayout>
  );
}

import { withSwal } from "react-sweetalert2";

function Categories() {
  return (
    <div>
      <h1>Categories({swal})</h1>
    </div>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);

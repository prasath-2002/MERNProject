import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder } from "../../actions/orderActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError } from "../../slices/orderSlice";
import { Link } from "react-router-dom";
import { getAdminProducts } from "../../actions/productActions";
import { MDBDataTable } from "mdbreact";

export default function UpdateOrder () {
    
    

    // const { products = [] }  = useSelector(state => state.productsState)
    // const { isProductDeleted, error:productError }  = useSelector(state => state.productState)

    const { loading, isOrderUpdated, error, orderDetail } = useSelector( state => state.orderState)
    const { user = {}, orderItems = [], shippingInfo = {}, totalPrice = 0, paymentInfo = {}} = orderDetail;
    const isPaid = paymentInfo.status === 'succeeded'? true: false;
    const [orderStatus, setOrderStatus] = useState("Processing");
    const { id:orderId } = useParams();
    // const dispatch = useDispatch();
    const { id } = useParams()

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        const orderData = {};
        orderData.orderStatus = orderStatus;
        dispatch(updateOrder(orderId, orderData))
    }

    // for stock display
    // useEffect(()=>{
    //     if(isReviewSubmitted) {
    //         handleClose()
    //         toast('Review Submitted successfully',{
    //             type: 'success',
    //             position: toast.POSITION.BOTTOM_CENTER,
    //             onOpen: () => dispatch(clearReviewSubmitted())
    //         })
            
    //     }
    //     if(error)  {
    //         toast(error, {
    //             position: toast.POSITION.BOTTOM_CENTER,
    //             type: 'error',
    //             onOpen: ()=> { dispatch(clearError()) }
    //         })
    //         return
    //     }
    //     if(!product._id || isReviewSubmitted) {
    //         dispatch(getProduct(id))
    //     }

    //     return () => {
    //         dispatch(clearProduct())
    //     }
        

    // },[dispatch,id,error])
    
    useEffect(() => {
        if(isOrderUpdated) {
            toast('Order Updated Succesfully!',{
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearOrderUpdated())
            })
           
            return;
        }

        if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }

        dispatch(orderDetailAction(orderId))
    }, [isOrderUpdated, error, dispatch])


    useEffect(() => {
        dispatch(getAdminProducts);
        if(orderDetail._id) {
            setOrderStatus(orderDetail.orderStatus);
        }
    },[orderDetail])



        const { products = [] }  = useSelector(state => state.productsState)
        // const { isProductDeleted, error:productError }  = useSelector(state => state.productState)
    
        const setProducts = () => {
            const data = {
                columns : [
                    // {
                    //     label: 'ID',
                    //     field: 'id',
                    //     sort: 'asc'
                    // },
                    {
                        // label: 'Name',
                        field: 'name',
                        sort: 'asc'
                    },
                    {
                        // label: 'Price',
                        field: 'price',
                        sort: 'asc'
                    },
                    {
                        label: 'Stock',
                        field: 'stock',
                        sort: 'asc'
                    },
                    {
                        // label: 'Actions',
                        field: 'actions',
                        sort: 'asc'
                    }
                ],
                rows : []
            }
    
            products.forEach( product => {
                data.rows.push({
                    // id: product._id,
                    name: product.name,
                    price : `₹${product.price}`,
                    stock: product.stock,
                    // actions: (
                    //     <Fragment>
                    //         <Link to={`/admin/product/${product._id}`} > <i>Edit</i></Link>
                    //         <Button onClick={e => deleteHandler(e, product._id)} className="btn btn-primary">
                    //             <i>Delete</i>
                    //         </Button>
                    //     </Fragment>
                    // )
                })
            })

            return data;

        }


    return (
        <div className="row">
            <div className="col-12 col-md-2">
                    <Sidebar/>
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-8 mt-5 order-details">
    
                            <h1 className="my-5">Order # {orderDetail._id}</h1>
    
                            <h4 className="mb-4">Shipping Info</h4>
                            <p><b>Name:</b> {user.name}</p>
                            <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                            <p className="mb-4"><b>Address:</b>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
                            <p><b>Amount:</b> ₹{totalPrice}</p>
    
                            <hr />
    
                            <h4 className="my-4">Payment</h4>
                            <p className={isPaid ? 'greenColor' : 'redColor' } ><b>{isPaid ? 'PAID' : 'NOT PAID' }</b></p>
    
    
                            <h4 className="my-4">Order Status:</h4>
                            <p className={orderStatus&&orderStatus.includes('Delivered') ? 'greenColor' : 'redColor' } ><b>{orderStatus}</b></p>
    
    
                            <h4 className="my-4">Order Items:</h4>
    
                            <hr />
                            <div className="cart-item my-1">
                                {orderItems && orderItems.map(item => (
                                    <div className="row my-5">
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-5">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p>₹{item.price}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{item.quantity} Piece(s)</p>
                                        </div>

                                        <h5><b>Selected Item Stock : </b>{<MDBDataTable
                                            data={setProducts()}
                                            paging={false}
                                            searching={false}
                                            bordered
                                            striped
                                            hover
                                            className="px-3"
                                           />}
                                        </h5>
                                    </div>
                                ))}
                                    
                            </div>
                            <hr />
                        </div>
                        <div className="col-12 col-lg-3 mt-5">
                            <h4 className="my-4">Order Status</h4>
                            <div className="form-group">
                                <select 
                                className="form-control"
                                onChange={e => setOrderStatus(e.target.value)}
                                value={orderStatus}
                                name="status"
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Out of Stock
                                    The PAID Amount is refunded to your Account With in 3 Working Days
                                    ">Out Of Stock</option>
                                </select>
                              
                            </div>
                            <button
                                disabled={loading}
                                onClick={submitHandler}
                                className="btn btn-primary btn-block"
                                >
                                    Update Status
                            </button>

                            

                        </div>

                        
                    </div>
                </Fragment>
            </div>
        </div>
        
    )
}
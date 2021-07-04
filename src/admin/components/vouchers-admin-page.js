import React from 'react';
import {HOST} from "../../commons/hosts"
import {Button} from "react-bootstrap"
import {
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';


import axios from 'axios';
import VoucherCreationForm from './voucher-creation-form';
import VoucherUpdateForm from "./voucher-update-form"
import ReactSpinner from 'react-bootstrap-spinner'

class VouchersAdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            voucherList: [],
            errorStatus: 0,
            error: '',
            selected_create_voucher: false,
            selected_update_voucher: false,
            selected_voucher: {},
            done: false
        }
        this.fetchVouchers = this.fetchVouchers.bind(this);
        this.toggleAddVoucher = this.toggleAddVoucher.bind(this);
        this.toggleUpdateVoucher = this.toggleUpdateVoucher.bind(this);
    }

    fetchVouchers() {
        return axios.get(HOST.backend_api + "/vouchers")
            .then(resp => {
                this.setState({voucherList: resp.data, done: true})
            });
    }

    componentDidMount() {
        this.fetchVouchers();
    }

    toggleAddVoucher(voucher) {
        this.setState(
            {
                selected_create_voucher: !this.state.selected_create_voucher
            }
        )
    }

    toggleUpdateVoucher(voucher) {
        if (this.state.selected_update_voucher === true) {
            this.setState(
                {
                    selected_update_voucher: !this.state.selected_update_voucher
                }
            )
        } else {
            this.setState(
                {
                    selected_update_voucher: !this.state.selected_update_voucher,
                    selected_voucher: JSON.parse(JSON.stringify(voucher))
                }
            )
        }
    }

    refresh() {
        window.location.reload(false);
    }

    render() {
        
        if (localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== undefined) {
            if (JSON.parse(localStorage.getItem("loggedUser")).role === "ADMIN") {
        const {done} = this.state;
        var {voucherList} = this.state;
        if (voucherList.length > 0) {
            voucherList = voucherList.filter(function(item) {
                return item.code !== "NONE"
            })
        }
        return (
            <div>
                <h1 style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>VOUCHERS</h1>
            <div style={{marginBottom:'20px', marginTop:'20px'}}>
                
                <Button onClick={this.toggleAddVoucher} style={{marginBottom:'20px'}} variant="danger">NEW VOUCHER</Button>

                {(done === true ?  
                    (voucherList.length > 0 ? 
                    
                    <div className="row" style={{marginLeft:'100px', marginRight:'100px'}}>
                        <div style={{width:'100%'}} data-aos="fade-up" data-aos-duration="1000">
                        <table className="table table-striped table-bordered">
                            <thead className="tbl-head">
                            <tr>
                                <th className="text-center" width='50px'> ID</th>
                                <th className="text-center"> CODE </th>
                                <th className="text-center"> DISCOUNT </th>
                                <th className="text-center"> AVAILABILITY </th>
                                <th className="text-center"> ONE USE ONLY </th>
                                <th className="text-center"> ACTIONS </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                voucherList.map(
                                    voucher => 
                                        <tr key={voucher.productId}>
                                            <td className="text-center"> {voucher.voucherId}</td>
                                            <td className="text-center"> {voucher.code}</td>
                                            <td className="text-center"> {voucher.discount}%</td>
                                            <td className="text-center"> {new Date(voucher.startDate.substring(0,10)).toDateString()} - {new Date(voucher.endDate.substring(0,10)).toDateString()}</td>
                                            <td className="text-center"> {(voucher.oneTimeOnly === true ? "Yes" : "No")}</td>
                                            <td className="text-center"> <Button onClick={() => this.toggleUpdateVoucher(voucher)} style={{margin:'5px'}} variant='outline-danger' size='sm'>UPDATE</Button></td>
                                        </tr>)
                            }
                            </tbody>
                        </table>
                    </div></div> : <div >No vouchers</div>)
                
                : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)
                }
                <Modal isOpen={this.state.selected_create_voucher} toggle={this.toggleAddVoucher}
                    className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleAddVoucher} style={{color:'rgb(220,53,69)'}}> Create voucher </ModalHeader>
                <ModalBody>
                    <VoucherCreationForm reloadHandler={this.refresh}/>
                </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selected_update_voucher} toggle={this.toggleUpdateVoucher}
                    className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleUpdateVoucher} style={{color:'rgb(220,53,69)'}}> Update voucher </ModalHeader>
                <ModalBody>
                    <VoucherUpdateForm voucher={this.state.selected_voucher} reloadHandler={this.refresh}/>
                </ModalBody>
                </Modal>
            </div></div>
        );
        } else {
            return (
                <div style={{margin: "auto"}}>
                    <div className="card-body">
                        <h2 style={{color:'rgb(220,53,69)'}} className="card-title font-weight-bold">Access denied!</h2>
                        <p className="card-text text-muted">You do not have access to this page, as your role needs to be ADMIN.</p>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div style={{margin: "auto"}}>
                <div className="card-body">
                <h2 style={{color:'rgb(220,53,69)'}} className="card-title font-weight-bold">Access denied!</h2>
                    <p className="card-text text-muted">You do not have access to this page, as your role needs to be ADMIN.</p>
                </div>
            </div>
        )
    } 
    }

}

export default VouchersAdminPage
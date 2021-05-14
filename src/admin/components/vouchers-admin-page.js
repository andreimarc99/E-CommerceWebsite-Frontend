import React from 'react';
import {withRouter} from "react-router-dom";
import {HOST} from "../../commons/hosts"
import {Button} from "react-bootstrap"
import {
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';


import axios from 'axios';
import ComplaintResponseForm from './complaint-response-form';
import VoucherCreationForm from './voucher-creation-form';
import VoucherUpdateForm from "./voucher-update-form"

const columns = [
    {
        Header: 'Code',
        accessor: 'code',
    },
    {
        Header: 'Discount',
        accessor: 'discount',
    }
];

const filters = [
    {
        accessor: 'code',
    }
];


class VouchersAdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            voucherList: [],
            errorStatus: 0,
            error: '',
            selected_create_voucher: false,
            selected_update_voucher: false,
            selected_voucher: {}
        }
        this.fetchVouchers = this.fetchVouchers.bind(this);
        this.toggleAddVoucher = this.toggleAddVoucher.bind(this);
        this.toggleUpdateVoucher = this.toggleUpdateVoucher.bind(this);
    }

    fetchVouchers() {
        return axios.get(HOST.backend_api + "/vouchers")
            .then(resp => {
                this.setState({voucherList: resp.data})
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
        var {voucherList} = this.state;
        if (voucherList.length > 0) {
            voucherList = voucherList.filter(function(item) {
                return item.code !== "NONE"
            })
        }
        return (
            <div style={{marginBottom:'20px', marginTop:'20px'}}>
                <h3>Existing vouchers in the system</h3>
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 10
                }}/>
                
                <Button onClick={this.toggleAddVoucher} style={{marginBottom:'20px'}} variant="danger">Create new voucher</Button>
                {(voucherList.length > 0 ? 
                <div className="row" style={{marginLeft:'30px', marginRight:'30px'}}>
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th className="text-center" width='50px'> ID</th>
                        <th className="text-center"> Code </th>
                        <th className="text-center"> Discount </th>
                        <th className="text-center"> Availability </th>
                        <th className="text-center"> One Use Only </th>
                        <th className="text-center"> Actions </th>
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
                                    <td className="text-center"> <Button onClick={() => this.toggleUpdateVoucher(voucher)} style={{margin:'5px'}} variant='outline-danger' size='sm'>Update</Button></td>
                                </tr>)
                    }
                    </tbody>
                </table>
            </div>
                : <div />)
                }
                <Modal isOpen={this.state.selected_create_voucher} toggle={this.toggleAddVoucher}
                    className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleAddVoucher} style={{color:'rgb(255,81,81)'}}> Create voucher </ModalHeader>
                <ModalBody>
                    <VoucherCreationForm reloadHandler={this.refresh}/>
                </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selected_update_voucher} toggle={this.toggleUpdateVoucher}
                    className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleUpdateVoucher} style={{color:'rgb(255,81,81)'}}> Update voucher </ModalHeader>
                <ModalBody>
                    <VoucherUpdateForm voucher={this.state.selected_voucher} reloadHandler={this.refresh}/>
                </ModalBody>
                </Modal>
            </div>
        );
    }

}

export default VouchersAdminPage
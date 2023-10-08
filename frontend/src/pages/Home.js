import React from 'react'
import { Button, Grid, Typography, Card, CardContent, CardActions, TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl';

const ChallanCard = (props) => {
    return (
        <Card sx={{
            width: '45%',
            margin: 2,
        }}>
            <CardContent>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Challan ID: {props.challanId}
                    </Typography>
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Vehicle Number: {props.vehicleNumber}
                    </Typography>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Violation Type: {props.violationType}
                    </Typography>
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Amount: {props.amount}
                    </Typography>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Due Date: {props.dueDate}
                    </Typography>
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Issue Date: {props.issueDate}
                    </Typography>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Mobile Number: {props.mobileNumber}
                    </Typography>
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Owner Name: {props.ownerName}
                    </Typography>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Payment Status: {props.paymentStatus}
                    </Typography>
                    <Typography variant="body2" sx={{
                        width: '50%'
                    }}>
                        Reminder Sent: {props.reminderSent}
                    </Typography>
                </div>
            </CardContent>
            <CardActions>
                <Button size="small" variant='outlined'
                    onClick={() => {
                        props.setChallanId(props.challanId)
                        props.setVehicleNumber(props.vehicleNumber)
                        props.setViolationType(props.violationType)
                        props.setAmount(props.amount)
                        props.setDueDate(props.dueDate)
                        props.setOwnerName(props.ownerName)
                        props.setMobileNumber(props.mobileNumber)
                        props.setPaymentStatus(props.paymentStatus)
                        props.setIssueDate(props.issueDate)
                        props.setReminderSent(props.reminderSent)
                        props.handleClickOpen()
                        props.setEditMode(true)
                    }}
                >Edit</Button>
                <Button size="small" variant='outlined' onClick={() => {

                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    var raw = JSON.stringify({
                        "challanId": props.challanId,
                        "vehicleNumber": props.vehicleNumber,
                        "violationType": props.violationType,
                        "amount": props.amount,
                        "dueDate": props.dueDate,
                        "ownerDetails": {
                            "name": props.ownerName,
                            "mobileNumber": props.mobileNumber,
                        },
                        "issueDate": props.issueDate,
                        paymentStatus: "Paid"
                    });

                    var requestOptions = {
                        method: 'PUT',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    fetch("http://localhost:4000/challans/add", requestOptions)
                        .then(response => response.text())
                        .then(result => 
                        {
                            console.log(result)
                            window.location.reload()
                        }
                        )
                        .catch(error => console.log('error', error));

                }}>Change to Paid</Button>
            </CardActions>
        </Card>
    )
}


const Home = () => {
    const [activePage, setActivePage] = React.useState('allChallans')
    const [searchText, setSearchText] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [challanId, setChallanId] = React.useState('')
    const [vehicleNumber, setVehicleNumber] = React.useState('')
    const [violationType, setViolationType] = React.useState('')
    const [amount, setAmount] = React.useState('')
    const [dueDate, setDueDate] = React.useState('')
    const [ownerName, setOwnerName] = React.useState('')
    const [mobileNumber, setMobileNumber] = React.useState('')
    const [paymentStatus, setPaymentStatus] = React.useState('')
    const [issueDate, setIssueDate] = React.useState('')
    const [reminderSent, setReminderSent] = React.useState('')
    const [allChallan, setAllChallan] = React.useState([])
    const [editMode, setEditMode] = React.useState(false)

    React.useEffect(() => {
        const APICall = async () => {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            await fetch("http://localhost:4000/challans/", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result)
                    setAllChallan(JSON.parse(result))
                })
                .catch(error => console.log('error', error));
        }
        APICall();
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (editMode === true) {
            console.log('edit mode')
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "challanId": challanId,
                "vehicleNumber": vehicleNumber,
                "violationType": violationType,
                "amount": amount,
                "dueDate": dueDate,
                "ownerDetails": {
                    "name": ownerName,
                    "mobileNumber": mobileNumber,
                },
                "issueDate": issueDate,
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:4000/challans/add", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
            setOpen(false);
            setEditMode(false)
            window.location.reload()
        }
        else {
            if (challanId === '' || vehicleNumber === '' || violationType === '' || amount === '' || dueDate === '' || ownerName === '' || mobileNumber === '' || paymentStatus === '' || issueDate === '' || reminderSent === '') {
                alert('Please fill all the fields')
                return
            }

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "challanId": challanId,
                "vehicleNumber": vehicleNumber,
                "violationType": violationType,
                "amount": amount,
                "dueDate": dueDate,
                "ownerDetails": {
                    "name": ownerName,
                    "mobileNumber": mobileNumber
                },
                "issueDate": issueDate,
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            console.log(raw)

            await fetch("http://localhost:4000/challans/add", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));


            setOpen(false);
        }
    }
    if (allChallan.length == 0) {
        return (
            <h1>LOADING....</h1>
        )
    }
    else
        return (
            <>
                <div
                    style={{
                        width: '100%',
                        height: '5%',
                        backgroundColor: 'lightblue',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <img src="https://i.imgur.com/YeRrMcP.png" alt="Plivo Logo" style={{ width: '30%' }} />
                </div>
                <Grid container>
                    <Grid item xs={2} sx={{
                        backgroundColor: 'lightblue',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Typography variant="h6" sx={{ marginTop: 2 }}>Challan Management</Typography>
                        <Button sx={{ marginTop: 2, width: '60%' }} variant="outlined" color='primary'
                            onClick={() => {
                                handleClickOpen()
                            }}
                        >Add Challan</Button>
                        <Button sx={{ marginTop: 2, width: '60%' }} variant="contained" color={activePage === 'allChallans' ? 'secondary' : 'primary'}
                            onClick={() => {
                                setActivePage('allChallans')
                            }}
                        >All Challans</Button>
                        <Button sx={{ marginTop: 2, width: '60%' }} variant="contained" color={activePage === 'pendingChallans' ? 'secondary' : 'primary'}
                            onClick={() => {
                                setActivePage('pendingChallans')
                            }}
                        >Pending Challans</Button>
                        <Button sx={{ marginTop: 2, marginBottom: '100%', width: '60%' }} variant="contained" color={activePage === 'paidChallans' ? 'secondary' : 'primary'}
                            onClick={() => {
                                setActivePage('paidChallans')
                            }}
                        >Paid Challans</Button>
                    </Grid>
                    <Grid item xs={10} spacing={2}>

                        <TextField label="Search" type="search" variant="outlined" sx={{ width: '30%', marginTop: 2, marginLeft: 2 }}
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value)
                            }} />

                        <Grid container>
                            {allChallan.map((challan) => {
                                if (activePage === 'allChallans') {
                                    if (challan.vehicleNumber.toLowerCase().includes(searchText.toLowerCase()) === true || challan.ownerDetails.name.toLowerCase().includes(searchText.toLowerCase()) === true || challan.ownerDetails.mobileNumber.toLowerCase().includes(searchText.toLowerCase()) === true || challan.violationType.toLowerCase().includes(searchText.toLowerCase()) === true || challan.paymentStatus.toLowerCase().includes(searchText.toLowerCase()) === true  || challan.amount.toString().includes(searchText.toLowerCase()) === true || challan.challanId.toString().includes(searchText.toLowerCase()) === true || challan.dueDate.toString().includes(searchText.toLowerCase()) === true || challan.issueDate.toString().includes(searchText.toLowerCase()) === true) {
                                        return (
                                            <ChallanCard
                                                challanId={challan.challanId}
                                                vehicleNumber={challan.vehicleNumber}
                                                violationType={challan.violationType}
                                                amount={challan.amount}
                                                dueDate={challan.dueDate.slice(0, 10)}
                                                issueDate={(challan.issueDate).slice(0, 10)}
                                                mobileNumber={challan.ownerDetails.mobileNumber}
                                                ownerName={challan.ownerDetails.name}
                                                paymentStatus={challan.paymentStatus}
                                                reminderSent={challan.reminderSent == false ? "False" : "True"}
                                                setChallanId={setChallanId}
                                                setVehicleNumber={setVehicleNumber}
                                                setViolationType={setViolationType}
                                                setAmount={setAmount}
                                                setDueDate={setDueDate}
                                                setOwnerName={setOwnerName}
                                                setMobileNumber={setMobileNumber}
                                                setPaymentStatus={setPaymentStatus}
                                                setIssueDate={setIssueDate}
                                                setReminderSent={setReminderSent}
                                                handleClickOpen={handleClickOpen}
                                                editMode={editMode}
                                                setEditMode={setEditMode}
                                            />
                                        )
                                    }
                                    else if (searchText == '') {
                                        return (
                                            <ChallanCard
                                                challanId={challan.challanId}
                                                vehicleNumber={challan.vehicleNumber}
                                                violationType={challan.violationType}
                                                amount={challan.amount}
                                                dueDate={challan.dueDate.slice(0, 10)}
                                                issueDate={(challan.issueDate).slice(0, 10)}
                                                mobileNumber={challan.ownerDetails.mobileNumber}
                                                ownerName={challan.ownerDetails.name}
                                                paymentStatus={challan.paymentStatus}
                                                reminderSent={challan.reminderSent == false ? "False" : "True"}
                                                setChallanId={setChallanId}
                                                setVehicleNumber={setVehicleNumber}
                                                setViolationType={setViolationType}
                                                setAmount={setAmount}
                                                setDueDate={setDueDate}
                                                setOwnerName={setOwnerName}
                                                setMobileNumber={setMobileNumber}
                                                setPaymentStatus={setPaymentStatus}
                                                setIssueDate={setIssueDate}
                                                setReminderSent={setReminderSent}
                                                handleClickOpen={handleClickOpen}
                                                editMode={editMode}
                                                setEditMode={setEditMode}
                                            />
                                        )
                                    }
                                }
                                else if (activePage === 'pendingChallans') {
                                    if (challan.paymentStatus === 'Unpaid') {
                                        if (challan.vehicleNumber.toLowerCase().includes(searchText.toLowerCase()) === true || challan.ownerDetails.name.toLowerCase().includes(searchText.toLowerCase()) === true || challan.ownerDetails.mobileNumber.toLowerCase().includes(searchText.toLowerCase()) === true || challan.violationType.toLowerCase().includes(searchText.toLowerCase()) === true || challan.paymentStatus.toLowerCase().includes(searchText.toLowerCase()) === true  || challan.amount.toString().includes(searchText.toLowerCase()) === true || challan.challanId.toString().includes(searchText.toLowerCase()) === true || challan.dueDate.toString().includes(searchText.toLowerCase()) === true || challan.issueDate.toString().includes(searchText.toLowerCase()) === true) {
                                            return (
                                                <ChallanCard
                                                    challanId={challan.challanId}
                                                    vehicleNumber={challan.vehicleNumber}
                                                    violationType={challan.violationType}
                                                    amount={challan.amount}
                                                    dueDate={challan.dueDate.slice(0, 10)}
                                                    issueDate={(challan.issueDate).slice(0, 10)}
                                                    mobileNumber={challan.ownerDetails.mobileNumber}
                                                    ownerName={challan.ownerDetails.name}
                                                    paymentStatus={challan.paymentStatus}
                                                    reminderSent={challan.reminderSent == false ? "False" : "True"}
                                                    setChallanId={setChallanId}
                                                    setVehicleNumber={setVehicleNumber}
                                                    setViolationType={setViolationType}
                                                    setAmount={setAmount}
                                                    setDueDate={setDueDate}
                                                    setOwnerName={setOwnerName}
                                                    setMobileNumber={setMobileNumber}
                                                    setPaymentStatus={setPaymentStatus}
                                                    setIssueDate={setIssueDate}
                                                    setReminderSent={setReminderSent}
                                                    handleClickOpen={handleClickOpen}
                                                    editMode={editMode}
                                                    setEditMode={setEditMode}
                                                />
                                            )
                                        }
                                        else if (searchText == '') {
                                            return (
                                                <ChallanCard
                                                    challanId={challan.challanId}
                                                    vehicleNumber={challan.vehicleNumber}
                                                    violationType={challan.violationType}
                                                    amount={challan.amount}
                                                    dueDate={challan.dueDate.slice(0, 10)}
                                                    issueDate={(challan.issueDate).slice(0, 10)}
                                                    mobileNumber={challan.ownerDetails.mobileNumber}
                                                    ownerName={challan.ownerDetails.name}
                                                    paymentStatus={challan.paymentStatus}
                                                    reminderSent={challan.reminderSent == false ? "False" : "True"}
                                                    setChallanId={setChallanId}
                                                    setVehicleNumber={setVehicleNumber}
                                                    setViolationType={setViolationType}
                                                    setAmount={setAmount}
                                                    setDueDate={setDueDate}
                                                    setOwnerName={setOwnerName}
                                                    setMobileNumber={setMobileNumber}
                                                    setPaymentStatus={setPaymentStatus}
                                                    setIssueDate={setIssueDate}
                                                    setReminderSent={setReminderSent}
                                                    handleClickOpen={handleClickOpen}
                                                    editMode={editMode}
                                                    setEditMode={setEditMode}
                                                />
                                            )
                                        }
                                    }
                                }
                                else if (activePage === 'paidChallans') {
                                    if (challan.paymentStatus === 'Paid') {
                                        if (challan.vehicleNumber.toLowerCase().includes(searchText.toLowerCase()) === true || challan.ownerDetails.name.toLowerCase().includes(searchText.toLowerCase()) === true || challan.ownerDetails.mobileNumber.toLowerCase().includes
                                            (searchText.toLowerCase()) === true || challan.violationType.toLowerCase().includes(searchText.toLowerCase()) === true || challan.paymentStatus.toLowerCase().includes(searchText.toLowerCase()) === true  || challan.amount.toString().includes(searchText.toLowerCase()) === true || challan.challanId.toString().includes(searchText.toLowerCase()) === true || challan.dueDate.toString().includes(searchText.toLowerCase()) === true || challan.issueDate.toString().includes(searchText.toLowerCase()) === true) {
                                            return (
                                                <ChallanCard
                                                    challanId={challan.challanId}
                                                    vehicleNumber={challan.vehicleNumber}
                                                    violationType={challan.violationType}
                                                    amount={challan.amount}
                                                    dueDate={challan.dueDate.slice(0, 10)}
                                                    issueDate={(challan.issueDate).slice(0, 10)}
                                                    mobileNumber={challan.ownerDetails.mobileNumber}
                                                    ownerName={challan.ownerDetails.name}
                                                    paymentStatus={challan.paymentStatus}
                                                    reminderSent={challan.reminderSent == false ? "False" : "True"}
                                                    setChallanId={setChallanId}
                                                    setVehicleNumber={setVehicleNumber}
                                                    setViolationType={setViolationType}
                                                    setAmount={setAmount}
                                                    setDueDate={setDueDate}
                                                    setOwnerName={setOwnerName}
                                                    setMobileNumber={setMobileNumber}
                                                    setPaymentStatus={setPaymentStatus}
                                                    setIssueDate={setIssueDate}
                                                    setReminderSent={setReminderSent}
                                                    handleClickOpen={handleClickOpen}
                                                    editMode={editMode}
                                                    setEditMode={setEditMode}
                                                />
                                            )
                                        }
                                        else if (searchText == '') {
                                            return (
                                                <ChallanCard
                                                    challanId={challan.challanId}
                                                    vehicleNumber={challan.vehicleNumber}
                                                    violationType={challan.violationType}
                                                    amount={challan.amount}
                                                    dueDate={challan.dueDate.slice(0, 10)}
                                                    issueDate={(challan.issueDate).slice(0, 10)}
                                                    mobileNumber={challan.ownerDetails.mobileNumber}
                                                    ownerName={challan.ownerDetails.name}
                                                    paymentStatus={challan.paymentStatus}
                                                    reminderSent={challan.reminderSent == false ? "False" : "True"}
                                                    setChallanId={setChallanId}
                                                    setVehicleNumber={setVehicleNumber}
                                                    setViolationType={setViolationType}
                                                    setAmount={setAmount}
                                                    setDueDate={setDueDate}
                                                    setOwnerName={setOwnerName}
                                                    setMobileNumber={setMobileNumber}
                                                    setPaymentStatus={setPaymentStatus}
                                                    setIssueDate={setIssueDate}
                                                    setReminderSent={setReminderSent}
                                                    handleClickOpen={handleClickOpen}
                                                    editMode={editMode}
                                                    setEditMode={setEditMode}
                                                />
                                            )
                                        }
                                    }
                                }
                            })}
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Create Challan</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To create a challan, please enter the details below.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="normal"
                            id="challanId"
                            label="Challan ID"
                            type="text"
                            fullWidth
                            value={challanId}
                            onChange={(e) => {
                                setChallanId(e.target.value)
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="normal"
                            id="vehicleNumber"
                            label="Vehicle Number"
                            type="text"
                            fullWidth
                            value={vehicleNumber}
                            onChange={(e) => {
                                setVehicleNumber(e.target.value)
                            }}
                        />
                        <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
                            <InputLabel>Violation Type</InputLabel>
                            <Select
                                margin='normal'
                                value={violationType}
                                label="Violation Type"
                                onChange={(e) => {
                                    setViolationType(e.target.value)
                                }}
                            >
                                <MenuItem value="Speeding">Speeding</MenuItem>
                                <MenuItem value="Illegal Parking">Illegal Parking</MenuItem>
                                <MenuItem value="Red Light Violation">Red Light Violation</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="normal"
                            id="amount"
                            label="Amount"
                            type="number"
                            fullWidth
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value)
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="normal"
                            id="dueDate"
                            label="Due Date"
                            type="date"
                            fullWidth
                            value={dueDate || new Date()}
                            onChange={(e) => {
                                setDueDate(e.target.value)
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="normal"
                            id="ownerName"
                            label="Owner Name"
                            type="text"
                            fullWidth
                            value={ownerName}
                            onChange={(e) => {
                                setOwnerName(e.target.value)
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="normal"
                            id="mobileNumber"
                            label="Mobile Number"
                            fullWidth
                            value={mobileNumber}
                            onChange={(e) => {
                                setMobileNumber(e.target.value)
                            }}
                        />
                        <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
                            <InputLabel>Payment Status</InputLabel>
                            <Select
                                value={paymentStatus}
                                label="Payment Status"
                                onChange={(e) => {
                                    setPaymentStatus(e.target.value)
                                }}
                            >
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Unpaid">Unpaid</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="normal"
                            id="issueDate"
                            label="Issue Date"
                            type="date"
                            fullWidth
                            value={issueDate || new Date()}
                            onChange={(e) => {
                                setIssueDate(e.target.value)
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="normal"
                            id="reminderSent"
                            label="Reminder Sent"
                            type="text"
                            fullWidth
                            value={reminderSent}
                            onChange={(e) => {
                                setReminderSent(e.target.value)
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
}

export default Home
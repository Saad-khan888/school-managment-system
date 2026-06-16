import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setClassFee } from '../../../redux/feeRelated/feeHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Typography,
    Paper,
    Container
} from '@mui/material';
import { BlueButton } from '../../../components/buttonStyles';

const SetFee = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    
    const { currentUser } = useSelector(state => state.user);
    const { sclassesList } = useSelector(state => state.sclass);
    const { loading } = useSelector(state => state.fee);

    const [selectedClass, setSelectedClass] = useState('');
    const [amount, setAmount] = useState('');
    const [period, setPeriod] = useState('Monthly');

    const periods = ['Monthly', 'Quarterly', 'Yearly', 'One-time'];

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    useEffect(() => {
        if (params.id) {
            setSelectedClass(params.id);
        }
    }, [params.id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const fields = {
            sclassId: selectedClass,
            amount: Number(amount),
            period,
            adminID: currentUser._id
        };

        dispatch(setClassFee(fields));
        navigate('/Admin/fees');
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 4 }}>
                <Paper elevation={3} sx={{ padding: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Set Class Fee
                    </Typography>
                    
                    <form onSubmit={handleSubmit}>
                        <TextField
                            select
                            label="Select Class"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                        >
                            {sclassesList && sclassesList.map((classItem) => (
                                <MenuItem key={classItem._id} value={classItem._id}>
                                    {classItem.sclassName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Fee Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                        />

                        <TextField
                            select
                            label="Fee Period"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                        >
                            {periods.map((p) => (
                                <MenuItem key={p} value={p}>
                                    {p}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Box sx={{ marginTop: 3, display: 'flex', gap: 2 }}>
                            <BlueButton
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Fee'}
                            </BlueButton>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/Admin/fees')}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default SetFee;

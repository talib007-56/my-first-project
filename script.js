document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('bmi-gauge').getContext('2d');
    const gaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Underweight', 'Normal weight', 'Overweight', 'Obesity'],
            datasets: [{
                data: [0, 0, 0, 0], // Initialize with empty data
                backgroundColor: ['#00c0ef', '#00a65a', '#f39c12', '#dd4b39'],
                borderWidth: 0,
            }]
        },
        options: {
            cutout: '70%',
            rotation: -Math.PI,
            circumference: Math.PI,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ' + context.raw + '%';
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 16,
                            style: 'bold',
                            family: 'Montserrat'
                        },
                        color: 'white', // Set legend labels color to white
                        padding: 20,
                        boxWidth: 20,
                        boxHeight: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            }
        }
    });

    function updateResult() {
        let weight = parseFloat(document.getElementById('weight').value);
        let height = parseFloat(document.getElementById('height').value);
    
        document.getElementById('weight-value').textContent = weight;
        document.getElementById('height-value').textContent = height;
    
        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            document.getElementById('result').innerHTML = 'Please enter valid weight and height values.';
            return;
        }
    
        let heightInMeters = height / 100;
    
        if (heightInMeters < 0.5 || heightInMeters > 3) {
            document.getElementById('result').innerHTML = 'Please enter a realistic height value.';
            return;
        }
    
        let bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        let category = '';
        let underweight = 0, normalWeight = 0, overweight = 0, obesity = 0;
    
        if (bmi < 18.5) {
            category = 'Underweight';
            underweight = 100;
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Normal weight';
            normalWeight = 100;
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Overweight';
            overweight = 100;
        } else {
            category = 'Obesity';
            obesity = 100;
        }
    
        document.getElementById('result').innerHTML = `Your BMI is ${bmi} (${category})`;
    
        gaugeChart.data.datasets[0].data = [underweight, normalWeight, overweight, obesity];
        gaugeChart.update();
    }
    
    function updateSliderBackground(slider) {
        const min = slider.min;
        const max = slider.max;
        const value = slider.value;

        const percentage = ((value - min) / (max - min)) * 100;

        slider.style.background = `linear-gradient(to right, #6a11cb ${percentage}%, #ddd ${percentage}%)`;
    }

    document.getElementById('weight').addEventListener('input', function () {
        updateResult();
        updateSliderBackground(this);
    });

    document.getElementById('height').addEventListener('input', function () {
        updateResult();
        updateSliderBackground(this);
    });

    // Initial calculation and slider background update
    updateResult();
    updateSliderBackground(document.getElementById('weight'));
    updateSliderBackground(document.getElementById('height'));
});

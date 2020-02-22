import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as userProfileInforService from '../../../services/userProfileInfoService';

class UserProfileInfoDemographics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            demographicInfo: [],
            getDemographicInfo: false
        };
    };

    componentDidMount() {
        userProfileInforService.getDemographicData()
            .then(response => {
                this.setState({
                    demographicInfo: response.items,
                    getDemographicInfo: true
                })
            })
            .catch(console.log)
    };

    pieConfig(title, data, subtitle) {
        const config = {
            chart: {
                plotBackgroundColor: null,
                plotShadow: false,
                type: 'pie',
                backgroundColor: 'rgba(0,0,0,.2)',
                shadow: true,
                spacingRight: 0,
                spacingLeft: 0
            },
            title: {
                text: title,
                style: {
                    color: '#FFFFFF'
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Percentage of users',
                colorByPoint: true,
                data: data
            }],
            subtitle: {
                text: subtitle,
                style: {
                    color: '#FFFFFF'
                }
            },
            credits: {
                enabled: false
            }
        };
        return config;
    }

    render() {
        const barGraphIcon = (
            <svg className="peity" height="36" width="65"><rect fill="rgba(255,255,255,0.85)" x="0.8981818181818183" y="12" width="2.694545454545455" height="24"></rect><rect fill="rgba(255,255,255,0.85)" x="5.389090909090909" y="20" width="2.6945454545454552" height="16"></rect><rect fill="rgba(255,255,255,0.85)" x="9.88" y="4" width="2.6945454545454535" height="32"></rect><rect fill="rgba(255,255,255,0.85)" x="14.370909090909093" y="12" width="2.6945454545454535" height="24"></rect><rect fill="rgba(255,255,255,0.85)" x="18.86181818181818" y="16" width="2.6945454545454552" height="20"></rect><rect fill="rgba(255,255,255,0.85)" x="23.35272727272727" y="12" width="2.6945454545454552" height="24"></rect><rect fill="rgba(255,255,255,0.85)" x="27.84363636363636" y="8" width="2.6945454545454552" height="28"></rect><rect fill="rgba(255,255,255,0.85)" x="32.334545454545456" y="4" width="2.6945454545454552" height="32"></rect><rect fill="rgba(255,255,255,0.85)" x="36.82545454545454" y="24" width="2.6945454545454623" height="12"></rect><rect fill="rgba(255,255,255,0.85)" x="41.31636363636363" y="16" width="2.6945454545454552" height="20"></rect><rect fill="rgba(255,255,255,0.85)" x="45.807272727272725" y="0" width="2.6945454545454552" height="36"></rect></svg>
        );
        const yearMapping = this.state.getDemographicInfo ? this.state.demographicInfo[1].map(data => {
            return {
                name: '<span style="color: #FFFFFF; fill: #FFFFFF">' + data.yearsInBusiness + '</span>',
                y: data.numberOfPeople
            }
        }) : 'loading';
        const ethnicityMapping = this.state.getDemographicInfo ? this.state.demographicInfo[2].map(data => {
            return {
                name: '<span style="color: #FFFFFF; fill: #FFFFFF">' + data.raceEthnicityId + '</span>',
                y: data.numberOfPeople
            }
        }) : 'loading';
        const educationMapping = this.state.getDemographicInfo ? this.state.demographicInfo[3].map(data => {
            return {
                name: '<span style="color: #FFFFFF; fill: #FFFFFF">' + data.levelOfEducationId + '</span>',
                y: data.numberOfPeople
            }
        }) : 'loading';
        const incomeMapping = this.state.getDemographicInfo ? this.state.demographicInfo[4].map(data => {
            return {
                name: '<span style="color: #FFFFFF; fill: #FFFFFF">' + data.householdIncome + '</span>',
                y: data.numberOfPeople
            }
        }) : 'loading';
        return (
            <div>
                <header className='content__title'>
                    <h1>Demographics</h1>
                    <small>Statistical data relating to LA Pathways users.</small>
                    <div className='actions'>
                        <a href='#' className='actions__item zmdi zmdi-trending-up'></a>
                        <a href='#' className='actions__item zmdi zmdi-check-all'></a>
                        <div className='dropdown actions__item'>
                            <i data-toggle='dropdown' className='zmdi zmdi-more-vert'></i>
                            <div className='dropdown-menu dropdown-menu-right'>
                                <a href='#' className='dropdown-item'>Refresh</a>
                                <a href='#' className='dropdown-item'>Manage Widgets</a>
                                <a href='#' className='dropdown-item'>Settings</a>
                            </div>
                        </div>
                    </div>
                </header>
                <div className='row quick-stats'>
                    <div className='col-sm-6 col-md-3'>
                        <div className='quick-stats__item'>
                            <div className='quick-stats__info'>
                                <h2>{this.state.getDemographicInfo ? this.state.demographicInfo[11][0].totalUsers : 'loading...'}</h2>
                                <small style={{ whiteSpace: 'normal' }}>Total Number of Entrepreneurs</small>
                            </div>
                            {barGraphIcon}
                        </div>
                    </div>
                    <div className='col-sm-6 col-md-3'>
                        <div className='quick-stats__item'>
                            <div className='quick-stats__info'>
                                <h2>{this.state.getDemographicInfo ? this.state.demographicInfo[10][0].totalPeople : 'loading...'}</h2>
                                <small style={{ whiteSpace: 'normal' }}>Total Number of Coaches/Mentors</small>
                            </div>
                            {barGraphIcon}
                        </div>
                    </div>
                    <div className='col-sm-6 col-md-3'>
                        <div className='quick-stats__item'>
                            <div className='quick-stats__info'>
                                <h2>{this.state.getDemographicInfo ? this.state.demographicInfo[8][0].avgYearsInBusiness : 'loading...'}</h2>
                                <small style={{ whiteSpace: 'normal' }}>Average Years in Business</small>
                            </div>
                            {barGraphIcon}
                        </div>
                    </div>
                    <div className='col-sm-6 col-md-3'>
                        <div className='quick-stats__item'>
                            <div className='quick-stats__info'>
                                <h2>{this.state.getDemographicInfo ? '$' + this.state.demographicInfo[9][0].avgHouseholdIncome : 'loading...'}</h2>
                                <small style={{ whiteSpace: 'normal' }}>Average Household Income</small>
                            </div>
                            {barGraphIcon}
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xl-6'>
                        <HighchartsReact highcharts={Highcharts} options={this.pieConfig('Race/Ethnicity Demographics', ethnicityMapping, 'Based on percentage of users')}></HighchartsReact>
                    </div>
                    <div className='col-xl-6'>
                        <HighchartsReact highcharts={Highcharts} options={this.pieConfig('Years in Business', yearMapping, 'Based on percentage of users')}></HighchartsReact>
                    </div>
                </div><br />
                <div className='row'>
                    <div className='col-xl-6'>
                        <HighchartsReact highcharts={Highcharts} options={this.pieConfig('Level of Education', educationMapping, 'Based on percentage of users')}></HighchartsReact>
                    </div>
                    <div className='col-xl-6'>
                        <HighchartsReact highcharts={Highcharts} options={this.pieConfig('Household Income', incomeMapping, 'Based on percentage of users')}></HighchartsReact>
                    </div>
                </div><br />
            </div>
        );
    };
};

export default UserProfileInfoDemographics;
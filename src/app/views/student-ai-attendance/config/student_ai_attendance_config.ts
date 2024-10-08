
// main query
export const config = {
    criteria_config: {
        indicatorName: 'Teacher Attendance',
        minRange: 0,
        maxRange: 100,
        defaultFromRange: 0,
        defaultToRange: 100,
        unitKey: "perc_teachers",
        linkedReports: ['lo_wise_performance', 'lo_average_barchart', 'lo_average_school']
    },
	filters: [
        //student-availability
		
		{
			label: 'Map View OF Student Attendance',

			name: 'class',

			labelProp: 'class_name',

			valueProp: 'class_name',

			id: 'class',

			// tableAlias: 'cc',

			query:
				'SELECT class_id,class_name FROM dimensions.class ORDER BY class_name ASC ',
		},
		
		{

            label: 'Map View OF Student Attendance',

            name: 'Metric',

            id: 'metric',

            values: ['percentage_of_student_present', 'percentage_of_student_absent'],

        },
		//lo-wise
       

        {
			label: 'Average Student Present',

            // displayLabel:'Class',

			name: 'class',

			labelProp: 'class_name',

			valueProp: 'class_name',

			id: 'class',

			// tableAlias: 'cc',

			query:
				'SELECT class_id,class_name FROM dimensions.class ORDER BY class_name ASC ',
		},
        {
			label: 'Average Student Absent',

            // displayLabel:'Class',

			name: 'class',

			labelProp: 'class_name',

			valueProp: 'class_name',

			id: 'class',

			// tableAlias: 'cc',

			query:
				'SELECT class_id,class_name FROM dimensions.class ORDER BY class_name ASC ',
		},
        
	
	],
    //student-availability query
	student_map: {

            label: 'Map View OF Student Attendance',
            filters: [
   
		

        {
			"name": "State",
			"hierarchyLevel": "1",
			"timeSeriesQueries": {"map": 
                `select district_id, district_name,latitude,longitude,present_students as percentage_of_student_present,total_students as total_students,
                absent_students as percentage_of_students_absent,ROUND((present_students * 100.0 / total_students), 2) AS perc_students, 
                ROUND((absent_students * 100.0 / total_students), 2) AS absent_students_percentage  from
                student_attendance.stud_map_dis smd   where  date between startDate and endDate  group by district_id,
                district_name,present_students,absent_students,total_students,latitude,longitude;`,},
			"actions": {
				"queries":	
				{
					"map": 
                    `select district_id, district_name,latitude,longitude,present_students as percentage_of_student_present,total_students as total_students,
                absent_students as percentage_of_students_absent,ROUND((present_students * 100.0 / total_students), 2) AS perc_students, 
                ROUND((absent_students * 100.0 / total_students), 2) AS absent_students_percentage  from
                student_attendance.stud_map_dis smd   where  date between startDate and endDate  group by district_id,
                district_name,present_students,absent_students,total_students,latitude,longitude;`,

			
				},
				"level": "district",
				"nextLevel": "block"
			}
		},
		{
            "name": "District",
            "hierarchyLevel": "2",
            "timeSeriesQueries":  {
                    "map": `
                    select block_id,block_name,latitude,longitude,present_students as percentage_of_student_present,total_students as total_students,absent_students as percentage_of_students_absent,
                    ROUND((present_students * 100.0 / total_students), 2) AS perc_students,  ROUND((absent_students * 100.0 / total_students), 2) AS absent_students_percentage from
                    student_attendance.stud_map_block smb   where  date between  startDate and endDate and district_id = {district_id}
                    group by block_id,block_name,present_students,absent_students,total_students,latitude,longitude;
                    `,

                    
                },
            "actions": {
                "queries":
                {
                    "map": `
                    select block_id,block_name,latitude,longitude,present_students as percentage_of_student_present,total_students as total_students,absent_students as percentage_of_students_absent,
                    ROUND((present_students * 100.0 / total_students), 2) AS perc_students,  ROUND((absent_students * 100.0 / total_students), 2) AS absent_students_percentage from
                    student_attendance.stud_map_block smb   where  date between  startDate and endDate and district_id = {district_id}
                    group by block_id,block_name,present_students,absent_students,total_students,latitude,longitude;
                    `,

                    
                },
                "level": "block",
                "nextLevel": "cluster"
            }
        },
        {
            "name": "Block",
            "hierarchyLevel": "3",
            "timeSeriesQueries":  {
                "map": `
                select cluster_id,cluster_name,latitude,longitude,present_students as percentage_of_student_present,total_students as total_students,
                absent_students as percentage_of_students_absent,ROUND((present_students * 100.0 / total_students), 2) AS perc_students, 
                ROUND((absent_students * 100.0 / total_students), 2) AS absent_students_percentage from student_attendance.stud_map_cluster smb 
                where  date between startDate and endDate and block_id = {block_id} group by
                cluster_id,cluster_name,present_students,absent_students,total_students,latitude,longitude;
                `,

            },
            "actions": {
                "queries":
                {
                    "map": `
                select cluster_id, cluster_name,latitude,longitude,present_students as percentage_of_student_present,total_students as total_students,
                absent_students as percentage_of_students_absent,ROUND((present_students * 100.0 / total_students), 2) AS perc_students, 
                ROUND((absent_students * 100.0 / total_students), 2) AS absent_students_percentage from student_attendance.stud_map_cluster smb 
                where  date between startDate and endDate and block_id = {block_id} group by
                cluster_id,cluster_name,present_students,absent_students,total_students,latitude,longitude;
                `,

                },
                "level": "cluster",
                "nextLevel": "school"
            }
        },
         {
                    "name": "Cluster",
                    "hierarchyLevel": "4",
                    "timeSeriesQueries": {
                        "map": `
                        select school_name,latitude,longitude,
                        present_students as percentage_of_student_present,total_students as total_students,absent_students as percentage_of_students_absent,
                        ROUND((present_students * 100.0 / total_students), 2) AS perc_students,  ROUND((absent_students * 100.0 / total_students), 2) AS absent_students_percentage  from
                        student_attendance.stud_map_school smb   where  date between startDate and endDate and cluster_id = {cluster_id}
                        group by school_name,present_students,absent_students,total_students,latitude,longitude;
                        `,},
                    "actions": {
                        "queries": {
                            "map": `
                        select school_name,latitude,longitude,
                        present_students as percentage_of_student_present,total_students as total_students,absent_students as percentage_of_students_absent,
                        ROUND((present_students * 100.0 / total_students), 2) AS perc_students,  ROUND((absent_students * 100.0 / total_students), 2) AS absent_students_percentage  from
                        student_attendance.stud_map_school smb   where  date between startDate and endDate and cluster_id = {cluster_id}
                        group by school_name,present_students,absent_students,total_students,latitude,longitude;
                        `,
                        },
                        "level": "school"
                    }
                }
            
	],
    
		options: {

			map: {

				metricFilterNeeded: true,

				indicator: 'metric',
                totalOfPercentage:"total_students",
                indicatorType: "percent",

				legend: {

					title: 'Student Attendance',

				},

				tooltipMetrics: [
					{
						valuePrefix: 'District ID: ',
						value: 'district_id',
						valueSuffix: '\n',
					},
					{
						valuePrefix: 'District Name: ',
						value: 'district_name',
						valueSuffix: '\n',
					},
					{
                        valuePrefix: 'Block ID: ',
                        value: 'block_id',
                        valueSuffix: '\n',
                    },
                    {
                        valuePrefix: 'Block Name: ',
                        value: 'block_name',
                        valueSuffix: '\n',
                    },
                    {
                        valuePrefix: 'Cluster ID: ',
                        value: 'cluster_id',
                        valueSuffix: '\n',
                    },
                    {
                        valuePrefix: 'Cluster Name: ',
                        value: 'cluster_name',
                        valueSuffix: '\n',
                    },
					{
						valuePrefix: 'Student Present: ',
						value: 'percentage_of_student_present',
						valueSuffix: '\n',
					},
					{
						valuePrefix: 'Student Absent: ',
						value: 'percentage_of_student_absent',
						valueSuffix: '\n',
					},
					{
						valuePrefix: 'Total Students: ',
						value: 'total_students',
						valueSuffix: '\n',
					},
					{
						valuePrefix: 'Average Students Present: ',
						value: 'perc_students',
						valueSuffix: '%\n',
					},
					{
						valuePrefix: 'Average Students Absent:',
						value: 'absent_students_percentage',
						valueSuffix: '%\n',
					},
					
				]

			}

		}

	},
	

 



    //lo-wise-query

    ///right table for lo
    student_average_table: {
        "label": "Average Student Present",
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "table": `select block_id,block_name,district_id,sum_attendance as present_students,count_attendance as total_students,
                    ROUND((sum_attendance *100) / count_attendance, 2) as perc_students from student_attendance.stud_avg_block sad   
                    where date BETWEEN startDate and endDate
                    group by block_id,block_name,district_id,present_students,total_students;`,
                },
                "actions": {
                    "queries": {
                        "table": `select block_id,block_name,district_id,sum_attendance as present_students,count_attendance as total_students,
                    ROUND((sum_attendance *100) / count_attendance, 2) as perc_students from student_attendance.stud_avg_block sad   
                    where date BETWEEN startDate and endDate
                    group by block_id,block_name,district_id,present_students,total_students;`,
                    },
                    "level": "district"
                }
            },
            {
                "name": "District",
                "labelProp": "district_name",
                "valueProp": "district_id",
                "hierarchyLevel": "2",
                "timeSeriesQueries": {
                    "table": `SELECT
                    ts.block_id,
                    b.block_name,
                    b.district_id,
                   
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND b.district_id = {district_id}
                GROUP BY
                    ts.block_id,
                    b.block_name,b.district_id;`,
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        ts.block_id,
                        b.block_name,
                        b.district_id,
                       
                        SUM(ts.attendance_status) AS present_students,
                        COUNT(ts.attendance_status) AS total_students,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    FROM
                        student_attendance.student_attendance_master ts
                    JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND b.district_id = {district_id}
                    GROUP BY
                        ts.block_id,
                        b.block_name,b.district_id;`,
                    },
                    "level": "block"
                }
            },
            {
                "name": "Block",
                "labelProp": "block_name",
                "valueProp": "block_id",
                "hierarchyLevel": "3",
                "timeSeriesQueries": {
                    "table": `SELECT
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    
                    b.district_id,
                   
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate  AND c.block_id = {block_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    b.district_id;`,
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        
                        b.district_id,
                       
                        SUM(ts.attendance_status) AS present_students,
                        COUNT(ts.attendance_status) AS total_students,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    FROM
                        student_attendance.student_attendance_master ts
                    JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    JOIN
                        dimensions.block b ON c.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate  AND c.block_id = {block_id}
                    GROUP BY
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        b.district_id;`,
                    },
                    "level": "cluster"
                }
            },
            {
                "name": "Cluster",
                "labelProp": "cluster_name",
                "valueProp": "cluster_id",
                "hierarchyLevel": "4",
                "timeSeriesQueries": {
                    "table": `SELECT
                    ts.school_id,
                    sch.school_name,
                    sch.cluster_id,
                    
                    c.block_id,
                    
                    b.district_id,
                    
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.school sch ON sch.school_id = ts.school_id
                JOIN
                    dimensions.cluster c ON sch.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                GROUP BY
                   ts.school_id,
                    sch.school_name,
                    sch.cluster_id,
                    
                    c.block_id,
                    b.district_id;
                
                    `
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        ts.school_id,
                        sch.school_name,
                        sch.cluster_id,
                        
                        c.block_id,
                        
                        b.district_id,
                        
                        SUM(ts.attendance_status) AS present_students,
                        COUNT(ts.attendance_status) AS total_students,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    FROM
                        student_attendance.student_attendance_master ts
                    JOIN
                        dimensions.school sch ON sch.school_id = ts.school_id
                    JOIN
                        dimensions.cluster c ON sch.cluster_id = c.cluster_id
                    JOIN
                        dimensions.block b ON c.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                    GROUP BY
                       ts.school_id,
                        sch.school_name,
                        sch.cluster_id,
                        
                        c.block_id,
                        b.district_id;
                    
                        `,
                    },
                    "level": "school"
                }
            },
            // {
            //     "name": "School",
            //     "labelProp": "school_name",
            //     "valueProp": "school_id",
            //     "hierarchyLevel": "5",
            //     "timeSeriesQueries": {
            //         "table": "select grade_number, ceil(round(CAST(COALESCE(avg(a.teachers_present/NULLIF(a.teachers_marked, 0))*100) as numeric),2)) as perc_teachers from  (select present_table.grade_state, present_table.school_id,present_table.date as att_date,present_table.sum as teachers_present,marked_table.sum as teachers_marked from datasets.sch_att_teacherspresent_daily_gender0school0grade as present_table join datasets.sch_att_teachersmarked_daily_gender0school0grade as marked_table on present_table.date = marked_table.date and present_table.school_id = marked_table.school_id and present_table.grade_state = marked_table.grade_state) as a join dimensions.grade as grade_wise_table on grade_wise_table.grade_id = a.grade_state where school_id = {school_id} and a.att_date between startDate and endDate group by a.grade_state, grade_number order by perc_teachers asc",
            //     },
            //     "actions": {
            //         "queries": {
            //             "table": "select min(date) as min_date, max(date) as max_date, t.grade, school_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_avg_atd_by_grade as t left join ingestion.dimension_master as m on t.school_id = m.school_id left join ingestion.dimension_district as d on d.district_id = m.district_id left join ingestion.dimension_block as b on b.block_id = m.block_id left join ingestion.dimension_cluster as c on c.cluster_id = m.cluster_id left join ingestion.dimension_school as s on s.school_id = t.school_id where t.school_id={school_id} group by t.grade, school_name,cluster_name,block_name,district_name",
            //         },
            //         "level": "school"
            //     }
            // }
        ],
        "options": {
            "table": {
                "columns": [
                    {
                        name: "State",
                        property: "state_name",
                        class: "text-left",
                        action: {
                            dataProps: [{
                                "prop": "state_id",
                                "alias": "id"
                            }, {
                                "prop": "state_name"
                            }],
                            extraInfo: {
                                hierarchyLevel: 1,
                                linkedReports: ["student_average_bignumber", "student_average_school","student_barchart","student_trendchart"]
                            },
                            allowedLevels: [1, 2, 3]
                        }
                    },
                    {
                        name: "District",
                        property: "district_name",
                        class: "text-left",
                        action: {
                            dataProps: [{
                                "prop": "district_id",
                                "alias": "id"
                            }, {
                                "prop": "district_name"
                            }],
                            extraInfo: {
                                hierarchyLevel: 2,
                                linkedReports: ["student_average_bignumber", "student_average_school","student_barchart","student_trendchart"]                            },
                            allowedLevels: [1, 2, 3]
                        }
                    },
                    {
                        name: "Block",
                        property: "block_name",
                        class: "text-left",
                        action: {
                            dataProps: [{
                                "prop": "block_id",
                                "alias": "id"
                            }, {
                                "prop": "block_name"
                            }],
                            extraInfo: {
                                hierarchyLevel: 3,
                                linkedReports: ["student_average_bignumber", "student_average_school","student_barchart","student_trendchart"]                            },
                            allowedLevels: [1, 2, 3]
                        }
                    },
                    {
                        name: "Cluster",
                        property: "cluster_name",
                        class: "text-left",
                        action: {
                            dataProps: [{
                                "prop": "cluster_id",
                                "alias": "id"
                            }, {
                                "prop": "cluster_name"
                            }],
                            extraInfo: {
                                hierarchyLevel: 4,
                                linkedReports: ["student_average_bignumber", "student_average_school","student_barchart","student_trendchart"]                            },
                            allowedLevels: [1, 2, 3]

                        }
                    },
                    {
                        name: "School",
                        property: "school_name",
                        class: "text-left"
                    },
                    {
                        name: "Grade",
                        property: "grade_number",
                        class: "text-center"
                    },
                    {
                        name: "% Average Present",
                        property: "perc_students",
                        class: "text-center",
                        valueSuffix: '%',
                        isHeatMapRequired: true,
                        type: "number",
                        color: {
                            type: "percentage",
                            values: [
                                {
                                    color: "#007000",
                                    breakPoint: 70
                                },
                                {
                                    color: "#FFBF00",
                                    breakPoint: 40
                                },
                                {
                                    color: "#D2222D",
                                    breakPoint: 0
                                }
                            ]
                        },
                    }
                ],
            },
            "bigNumber": {
                "valueSuffix": '%',
                "property": 'perc_teachers'
            }
        }
    },
//left table for bignumber
student_average_bignumber: {
        "label": "Average Student Present",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "bigNumber": `SELECT 
                    ROUND(AVG(perc_students)) AS percentage_students
                    from (SELECT 
                    ts.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate 
                GROUP BY
                    ts.district_id, d.district_name) AS avg_query;`

                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_students)) AS percentage_students
                        from (SELECT 
                        ts.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_students,
                        COUNT(ts.attendance_status) AS total_students,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    FROM
                        student_attendance.student_attendance_master ts
                    JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate 
                    GROUP BY
                        ts.district_id, d.district_name) AS avg_query;`
                    },
                    "level": "district"
                }
            },
            {
                "name": "District",
                "labelProp": "district_name",
                "valueProp": "district_id",
                "hierarchyLevel": "2",
                "timeSeriesQueries": {
                    "bigNumber": `SELECT 
                    ROUND(AVG(perc_students)) AS percentage_students
                    from (SELECT 
                    ts.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.district_id ={district_id}
                GROUP BY
                    ts.district_id, d.district_name) AS avg_query;`
                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_students)) AS percentage_students
                        from (SELECT 
                        ts.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_students,
                        COUNT(ts.attendance_status) AS total_students,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    FROM
                        student_attendance.student_attendance_master ts
                    JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND ts.district_id ={district_id}
                    GROUP BY
                        ts.district_id, d.district_name) AS avg_query;`
                    },
                    "level": "block"
                }
            },
           
            {
                "name": "Block",
                "labelProp": "block_name",
                "valueProp": "block_id",
                "hierarchyLevel": "3",
                "timeSeriesQueries": {
                    "bigNumber": `SELECT 
                    ROUND(AVG(perc_students)) AS percentage_students
                    from (SELECT
                    ts.block_id,
                    b.block_name,
                    b.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                GROUP BY
                    ts.block_id,
                    b.block_name,b.district_id, d.district_name) AS avg_query;
                    `,
                    
                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_students)) AS percentage_students
                        from (SELECT
                        ts.block_id,
                        b.block_name,
                        b.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_students,
                        COUNT(ts.attendance_status) AS total_students,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    FROM
                        student_attendance.student_attendance_master ts
                    JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                    GROUP BY
                        ts.block_id,
                        b.block_name,b.district_id, d.district_name) AS avg_query;
                        `,
                       
                    },
                    "level": "cluster"
                }
            },
            {
                "name": "Cluster",
                "labelProp": "cluster_name",
                "valueProp": "cluster_id",
                "hierarchyLevel": "4",
                "timeSeriesQueries": {
                    "bigNumber": `SELECT 
                    ROUND(AVG(perc_students)) AS percentage_students
                    from (SELECT
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    b.block_name,
                    b.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.cluster_id = {cluster_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    b.block_name,b.district_id, d.district_name) AS avg_query;	`,
                   
                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_students)) AS percentage_students
                        from (SELECT
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        b.block_name,
                        b.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_students,
                        COUNT(ts.attendance_status) AS total_students,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    FROM
                        student_attendance.student_attendance_master ts
                    JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    JOIN
                        dimensions.block b ON c.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND ts.cluster_id = {cluster_id}
                    GROUP BY
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        b.block_name,b.district_id, d.district_name) AS avg_query;`,
                        
                    },
                    "level": "school"
                }
            }
        ],
        "options": {
            "bigNumber": {
                "title": "Average Present",
                "valueSuffix": '%',
                "property": 'percentage_students'
            }
        }
    },

    //bottom table for all data
    student_average_school: {
        "label": "Average Student Present",
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "table": `
                    select
                    ts.district_id,d.district_name,
                    ts.school_id,sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_students,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_students,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    from
                    student_attendance.student_attendance_master ts
                    LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    LEFT JOIN
                        dimensions.class cc ON cc.class_id = ts.class_id
                    JOIN
                    (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       student_attendance.student_attendance_master ts
                       join dimensions.class cc on cc.class_id = ts.class_id
                       where
                       
                       ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date between startDate AND endDate
                    GROUP BY
                    ts.district_id,d.district_name,
                    ts.school_id,sch.school_name,days_count.total_days
                     `
                },
                "actions": {
                    "queries": {
                        "table": `
                        select
                        ts.district_id,d.district_name,
                        ts.school_id,sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_students,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_students,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                        from
                        student_attendance.student_attendance_master ts
                        LEFT JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        LEFT JOIN
                            dimensions.class cc ON cc.class_id = ts.class_id
                        JOIN
                        (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           student_attendance.student_attendance_master ts
                           join dimensions.class cc on cc.class_id = ts.class_id
                           where
                           
                           ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where ts.date between startDate AND endDate
                        GROUP BY
                        ts.district_id,d.district_name,
                        ts.school_id,sch.school_name,days_count.total_days
                         `,
                    },
                    "level": "school"
                }
            },
            {
                "name": "District",
                "labelProp": "district_name",
                "valueProp": "district_id",
                "hierarchyLevel": "2",
                "timeSeriesQueries": {
                    "table": `select
                    b.district_id,d.district_name,
                    
                    ts.school_id,sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_students,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_students,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    from
                    student_attendance.student_attendance_master ts
                    LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    LEFT JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                        JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       student_attendance.student_attendance_master ts
                       join dimensions.class cc on cc.class_id = ts.class_id
                       where 
                      
                       ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    where ts.date BETWEEN startDate AND endDate AND b.district_id = {district_id}
                    GROUP BY
                    b.district_id,d.district_name,
                    ts.school_id,sch.school_name,days_count.total_days
`
                },
                "actions": {
                    "queries": {
                        "table": `select
                        b.district_id,d.district_name,
                        
                        ts.school_id,sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_students,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_students,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                        from
                        student_attendance.student_attendance_master ts
                        LEFT JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        LEFT JOIN
                            dimensions.class cc ON ts.class_id = cc.class_id
                            JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           student_attendance.student_attendance_master ts
                           join dimensions.class cc on cc.class_id = ts.class_id
                           where 
                          
                        ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        where ts.date BETWEEN startDate AND endDate AND b.district_id = {district_id}
                        GROUP BY
                        b.district_id,d.district_name,
                        ts.school_id,sch.school_name,days_count.total_days
    `,
                    },
                    "level": "school"
                }
            },
            {
                "name": "Block",
                "labelProp": "block_name",
                "valueProp": "block_id",
                "hierarchyLevel": "3",
                "timeSeriesQueries": {
                    "table": `select
                    b.district_id,d.district_name,
                    c.block_id,b.block_name,
                    ts.school_id,sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_students,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_students,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    from
                    student_attendance.student_attendance_master ts
                    left JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    left JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    left JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    left JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    left JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                        JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       student_attendance.student_attendance_master ts
                       join dimensions.class cc on cc.class_id = ts.class_id
                       where 
                        
                       ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date BETWEEN startDate AND endDate  AND c.block_id = {block_id}
                    GROUP BY
                    b.district_id,d.district_name,
                    c.block_id,b.block_name,
                    ts.school_id,sch.school_name,days_count.total_days
                    `
                },
                "actions": {
                    "queries": {
                        "table": `select
                        b.district_id,d.district_name,
                        c.block_id,b.block_name,
                        ts.school_id,sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_students,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_students,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                        from
                        student_attendance.student_attendance_master ts
                        left JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        left JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        left JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        left JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        left JOIN
                            dimensions.class cc ON ts.class_id = cc.class_id
                            JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           student_attendance.student_attendance_master ts
                           join dimensions.class cc on cc.class_id = ts.class_id
                           where 
                            
                           ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where ts.date BETWEEN startDate AND endDate  AND c.block_id = {block_id}
                        GROUP BY
                        b.district_id,d.district_name,
                        c.block_id,b.block_name,
                        ts.school_id,sch.school_name,days_count.total_days
                        
    `,
                    },
                    "level": "school"
                }
            },
            {
                "name": "Cluster",
                "labelProp": "cluster_name",
                "valueProp": "cluster_id",
                "hierarchyLevel": "4",
                "timeSeriesQueries": {
                    "table":`select
                    b.district_id,d.district_name,
                    c.block_id,b.block_name,
                    sch.cluster_id, c.cluster_name,
                    ts.school_id,sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_students,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_students,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                    from
                    student_attendance.student_attendance_master ts
                    left JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    left JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    left JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    left JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    left JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                        JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       student_attendance.student_attendance_master ts
                       join dimensions.class cc on cc.class_id = ts.class_id
                       where 
                        
                       ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where  ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                    GROUP BY
                    b.district_id,d.district_name,
                    c.block_id,b.block_name,
                    sch.cluster_id, c.cluster_name,
                    ts.school_id,sch.school_name,days_count.total_days
`
                },
                "actions": {
                    "queries": {
                        "table": `select
                        b.district_id,d.district_name,
                        c.block_id,b.block_name,
                        sch.cluster_id, c.cluster_name,
                        ts.school_id,sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_students,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_students,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                        from
                        student_attendance.student_attendance_master ts
                        left JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        left JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        left JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        left JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        left JOIN
                            dimensions.class cc ON ts.class_id = cc.class_id
                            JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           student_attendance.student_attendance_master ts
                           join dimensions.class cc on cc.class_id = ts.class_id
                           where 
                            
                           ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where  ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                        GROUP BY
                        b.district_id,d.district_name,
                        c.block_id,b.block_name,
                        sch.cluster_id, c.cluster_name,
                        ts.school_id,sch.school_name,days_count.total_days`,
                    },
                    "level": "school"
                }
            }
        ],
        "options": {
            "table": {
                "columns": [
                    // {
                    //     name: "Date",
                    //     property: "ex_date",
                    //     class: "text-left",
                    //     type: "date",
                    // },
                    {
                        name: "District",
                        property: "district_name",
                        class: "text-center"
                    },
                    {
                        name: "Block",
                        property: "block_name",
                        class: "text-center"
                    },
                    {
                        name: "Cluster",
                        property: "cluster_name",
                        class: "text-center"
                    },
                    // {
                    //     name: "UDISE Code",
                    //     property: "udise_code",
                    //     class: "text-left"
                    // },
                    {
                        name: "SCHOOL Code",
                        property: "school_id",
                        class: "text-center"
                    },
                    {
                        name: "School",
                        property: "school_name",
                        class: "text-center"
                    },
                    {
                        name: "Total Students",
                        property: "total_students",
                        class: "text-center"
                    },
                    {
                        name: "Total Students Present",
                        property: "present_students",
                        class: "text-center"
                    },
                    {
                        name: "% Present Student",
                        property: "perc_students",
                        class: "text-center",
                        valueSuffix: '%',
                        isHeatMapRequired: true,
                        type: "number",
                        color: {
                            type: "percentage",
                            values: [
                                {
                                    color: "#007000",
                                    breakPoint: 70
                                },
                                {
                                    color: "#FFBF00",
                                    breakPoint: 40
                                },
                                {
                                    color: "#D2222D",
                                    breakPoint: 0
                                }
                            ]
                        },
                    }
                ],
            },
            "searchBar_config": {
                "title": "School Code",
                "searchProps": ['school_id'],
                "searchType": "number"
            },
            
        }
    },


    //
   

//pat bignumber1

student_attendance_bignumber1: {
    "label": "Average Teachers Present",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "bigNumber":`select ROUND((sum_attendance * 100.0 / count_attendance),2) AS present_students
                    FROM student_attendance.dash1 WHERE date = (SELECT MAX(date) FROM student_attendance.dash1);`,
                // `SELECT ROUND((CAST(sum(sam.attendance_status) AS DECIMAL(10,2)) * 100)/ count(sam.attendance_status) ,2) AS present_students
                // FROM student_attendance.student_attendance_master sam
                // WHERE date = (SELECT MAX(date) FROM student_attendance.student_attendance_master)`,
                // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
            },
            "actions": {
                "queries": {
                    "bigNumber": `select ROUND((sum_attendance * 100.0 / count_attendance),2) AS present_students
                    FROM student_attendance.dash1 WHERE date = (SELECT MAX(date) FROM student_attendance.dash1);`,
                    // `SELECT ROUND((CAST(sum(sam.attendance_status) AS DECIMAL(10,2)) * 100)/ count(sam.attendance_status) ,2) AS present_students
                    // FROM student_attendance.student_attendance_master sam
                    // WHERE date = (SELECT MAX(date) FROM student_attendance.student_attendance_master)`,
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
                },
                "level": "district"
            }
        }
        
    ],
    "options": {
        "bigNumber": {
            "title": "Percentage of Students Present",
            "valueSuffix": '%',
            "property": 'present_students'
        }
    }
},
student_attendance_bignumber2: {
    "label": "Average Teachers Present",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "bigNumber":`SELECT ROUND((CAST(count_attendance AS DECIMAL(10,2)) - sum_attendance) * 100 / count_attendance,
                                2) AS absent_students FROM student_attendance.dash1 WHERE date = (SELECT MAX(date) FROM student_attendance.dash1);`,
                // `SELECT ROUND((CAST(count(sam.attendance_status) AS DECIMAL(10,2)) - sum(sam.attendance_status)) * 100 / count(sam.attendance_status), 2) AS absent_students
                // FROM student_attendance.student_attendance_master sam
                // WHERE date = (SELECT MAX(date) FROM student_attendance.student_attendance_master);`,
                // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
            },
            "actions": {
                "queries": {
                    "bigNumber":`SELECT ROUND((CAST(count_attendance AS DECIMAL(10,2)) - sum_attendance) * 100 / count_attendance,
                                2) AS absent_students FROM student_attendance.dash1 WHERE date = (SELECT MAX(date) FROM student_attendance.dash1);`,
                    // `SELECT ROUND((CAST(count(sam.attendance_status) AS DECIMAL(10,2)) - sum(sam.attendance_status)) * 100 / count(sam.attendance_status), 2) AS absent_students
                    // FROM student_attendance.student_attendance_master sam
                    // WHERE date = (SELECT MAX(date) FROM student_attendance.student_attendance_master);`,
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
                },
                "level": "district"
            }
        }
        
    ],
    "options": {
        "bigNumber": {
            "title": "Percentage of Students Absent",
            "valueSuffix": '%',
            "property": 'absent_students'
        }
    }
},
// student_attendance_bignumber2: {
//     "label": "Average Teachers Present",
//     "filters": [
//         {
//             "name": "State",
//             "labelProp": "state_name",
//             "valueProp": "state_id",
//             "hierarchyLevel": "1",
//             "timeSeriesQueries": {
//                 "bigNumber":`select
//                 max
//                 (
//                 date
//                 ) as date
//                 from
//                 student_attendance.student_attendance_master sam`,
//                 // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
//             },
//             "actions": {
//                 "queries": {
//                     "bigNumber": `select
//                     max
//                     (
//                     date
//                     ) as date
//                     from
//                     student_attendance.student_attendance_master sam`,
//                     // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
//                 },
//                 "level": "district"
//             }
//         }
        
//     ],
//     "options": {
//         "bigNumber": {
//             "title": "Latest Date",
//             "valueSuffix": '',
//             "property": 'date'
//         }
//     }
// },


student_barchart:{
    "label": "Overall Summary",
    "defaultLevel": "state",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "barChart": `SELECT 
                ts.district_id,
                d.district_name as level,
                SUM(ts.attendance_status) AS present_students,
                COUNT(ts.attendance_status) AS total_students,
                ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
            FROM
                student_attendance.student_attendance_master ts
            JOIN
                dimensions.district d ON ts.district_id = d.district_id
            JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate 
            GROUP BY
                ts.district_id, d.district_name;
                `,
            },
            "actions": {
                "queries": {
                    "barChart":`SELECT 
                    ts.district_id,
                    d.district_name as level,
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate 
                GROUP BY
                    ts.district_id, d.district_name;
                    `
                
                },
                "level": "district"
            }
        },
        {
            "name": "District",
            "labelProp": "district_name",
            "valueProp": "district_id",
            "hierarchyLevel": "2",
            "timeSeriesQueries": {
                "barChart": `SELECT
                ts.block_id,
                b.block_name as level,
                b.district_id,
               
                SUM(ts.attendance_status) AS present_students,
                COUNT(ts.attendance_status) AS total_students,
                ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
            FROM
                student_attendance.student_attendance_master ts
            JOIN
                dimensions.block b ON ts.block_id = b.block_id
            JOIN
                dimensions.district d ON b.district_id = d.district_id
            JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate AND b.district_id = {district_id}
            GROUP BY
                ts.block_id,
                b.block_name,b.district_id; `,
            },
            "actions": {
                "queries": {
                    "barChart":
                    `SELECT
                    ts.block_id,
                    b.block_name as level,
                    b.district_id,
                   
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND b.district_id = {district_id}
                GROUP BY
                    ts.block_id,
                    b.block_name,b.district_id; `,
                },
                "level": "block"
            }
        },
        {
            "name": "Block",
            "labelProp": "block_name",
            "valueProp": "block_id",
            "hierarchyLevel": "3",
            "timeSeriesQueries": {
                "barChart": `SELECT
                ts.cluster_id,
                c.cluster_name as level,
                c.block_id,
                
                b.district_id,
               
                SUM(ts.attendance_status) AS present_students,
                COUNT(ts.attendance_status) AS total_students,
                ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
            FROM
                student_attendance.student_attendance_master ts
            JOIN
                dimensions.cluster c ON ts.cluster_id = c.cluster_id
            JOIN
                dimensions.block b ON c.block_id = b.block_id
            JOIN
                dimensions.district d ON b.district_id = d.district_id
            JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate  AND c.block_id = {block_id}
            GROUP BY
                ts.cluster_id,
                c.cluster_name,
                c.block_id,
                b.district_id;`,
            },
            "actions": {
                "queries": {
                    "barChart":`SELECT
                    ts.cluster_id,
                    c.cluster_name as level,
                    c.block_id,
                    
                    b.district_id,
                   
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate  AND c.block_id = {block_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    b.district_id;`
                },
                "level": "cluster"
            }
        },
        {
            "name": "Cluster",
            "labelProp": "cluster_name",
            "valueProp": "cluster_id",
            "hierarchyLevel": "4",
            "timeSeriesQueries": {
                "barChart": `SELECT
                ts.school_id,
                sch.school_name as level,
                sch.cluster_id,
                
                c.block_id,
                
                b.district_id,
                
                SUM(ts.attendance_status) AS present_students,
                COUNT(ts.attendance_status) AS total_students,
                ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
            FROM
                student_attendance.student_attendance_master ts
            JOIN
                dimensions.school sch ON sch.school_id = ts.school_id
            JOIN
                dimensions.cluster c ON sch.cluster_id = c.cluster_id
            JOIN
                dimensions.block b ON c.block_id = b.block_id
            JOIN
                dimensions.district d ON b.district_id = d.district_id
            JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
            GROUP BY
               ts.school_id,
                sch.school_name,
                sch.cluster_id,
                
                c.block_id,
                b.district_id;
            `,
            },
            "actions": {
                "queries": {
                    "barChart":`SELECT
                    ts.school_id,
                    sch.school_name as level,
                    sch.cluster_id,
                    
                    c.block_id,
                    
                    b.district_id,
                    
                    SUM(ts.attendance_status) AS present_students,
                    COUNT(ts.attendance_status) AS total_students,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_students
                FROM
                    student_attendance.student_attendance_master ts
                JOIN
                    dimensions.school sch ON sch.school_id = ts.school_id
                JOIN
                    dimensions.cluster c ON sch.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                GROUP BY
                   ts.school_id,
                    sch.school_name,
                    sch.cluster_id,
                    
                    c.block_id,
                    b.district_id;
                `
                },
                "level": "school"
            }
        },

    ],
    "options": {
        "barChart": {
            "metricLabelProp": "Percentage",
            "metricValueProp": "perc_students",
            "yAxis": {
                "title": "Average Percentage"
            },
            "benchmarkConfig": {
                "linkedReport": "tas_average_attendance_bignumber"
            },
            "xAxis": {
                "title": "District",
                "label": "level",
                "value": "level",

            },
            "tooltipMetrics": [
                {
                    "valuePrefix": "District Id: ",
                    "value": "district_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "District Name: ",
                    "value": "district_name",
                    "valueSuffix": ""
                },
               
                {
                    "valuePrefix": "Block Id: ",
                    "value": "block_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Block Name: ",
                    "value": "block_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Cluster Id: ",
                    "value": "cluster_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Cluster Name: ",
                    "value": "cluster_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "School Id: ",
                    "value": "school_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Present Students ",
                    "value": "present_students",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Present Students ",
                    "value": "total_students",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "School Name: ",
                    "value": "school_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Average Percentage Student: ",
                    "value": "perc_students",
                    "valueSuffix": ""
                },
                
                // {
                //     "valuePrefix": "Average percentage of LO: ",
                //     "value": "perc_lo",
                //     "valueSuffix": "%"
                // },
            ]
        }
    }
},
student_trendchart:{
    "label": "Overall Summary",
    "defaultLevel": "state",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "barChart": ` select 
                TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                coalesce(sum(sam.attendance_status),0) as student_present
                from
                student_attendance.student_attendance_master sam 
                left join
                dimensions.class cc  on sam.class_id = cc.class_id 
                where 
                sam.date between startDate and endDate  
                GROUP BY
                TO_CHAR(sam.date, 'YYYY-MM-DD')
                order by
                TO_CHAR(sam.date, 'YYYY-MM-DD');
            
             
                `,
            },
            "actions": {
                "queries": {
                    "barChart":` select 
                    TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(sam.attendance_status),0) as student_present
                    from
                    student_attendance.student_attendance_master sam 
                    left join
                    dimensions.class cc  on sam.class_id = cc.class_id 
                    where 
                    sam.date between startDate and endDate  
                    GROUP BY
                    TO_CHAR(sam.date, 'YYYY-MM-DD')
                    order by
                    TO_CHAR(sam.date, 'YYYY-MM-DD');
                
                 
                    `
                
                },
                "level": "district"
            }
        },
        {
            "name": "District",
            "labelProp": "district_name",
            "valueProp": "district_id",
            "hierarchyLevel": "2",
            "timeSeriesQueries": {
                "barChart": `select
                sam.district_id ,
                d.district_name,
                sam.block_id ,
                b.block_name,
                TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                coalesce(sum(sam.attendance_status),0) as student_present
                from
                student_attendance.student_attendance_master sam 
                left join
                dimensions.class cc  on sam.class_id = cc.class_id 
                left join 
                dimensions.district d on sam.district_id = d.district_id 
                left join 
                dimensions.block b on sam.block_id = b.block_id 
                where 
                sam.date between startDate and endDate   and sam.district_id = {district_id}
                group by 
                TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                b.block_name,
                d.district_name
                order by
                TO_CHAR(sam.date, 'YYYY-MM-DD');`,
            },
            "actions": {
                "queries": {
                    "barChart":
                    `select
                    sam.district_id ,
                    d.district_name,
                    sam.block_id ,
                    b.block_name,
                    TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(sam.attendance_status),0) as student_present
                    from
                    student_attendance.student_attendance_master sam 
                    left join
                    dimensions.class cc  on sam.class_id = cc.class_id 
                    left join 
                    dimensions.district d on sam.district_id = d.district_id 
                    left join 
                    dimensions.block b on sam.block_id = b.block_id 
                    where 
                    sam.date between startDate and endDate   and sam.district_id = {district_id}
                    group by 
                    TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                    b.block_name,
                    d.district_name
                    order by
                    TO_CHAR(sam.date, 'YYYY-MM-DD'); `,
                },
                "level": "block"
            }
        },
        {
            "name": "Block",
            "labelProp": "block_name",
            "valueProp": "block_id",
            "hierarchyLevel": "3",
            "timeSeriesQueries": {
                "barChart": `select
                sam.district_id ,
                d.district_name,
                sam.block_id ,
                b.block_name,
                sam.cluster_id,
                c.cluster_name,
                TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                coalesce(sum(sam.attendance_status),0) as student_present
                from
                student_attendance.student_attendance_master sam 
                left join
                dimensions.class cc  on sam.class_id = cc.class_id 
                left join 
                dimensions.district d on sam.district_id = d.district_id 
                left join 
                dimensions.block b on sam.block_id = b.block_id 
                left join 
                dimensions.cluster c on sam.cluster_id  = c.cluster_id  
                where 
                sam.date between startDate and endDate   and sam.block_id = {block_id}
                group by 
                TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                b.block_name,sam.cluster_id ,c.cluster_name,
                d.district_name
                ORDER BY
                TO_CHAR(sam.date, 'YYYY-MM-DD')`,
            },
            "actions": {
                "queries": {
                    "barChart":`select
                    sam.district_id ,
                    d.district_name,
                    sam.block_id ,
                    b.block_name,
                    sam.cluster_id,
                    c.cluster_name,
                    TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(sam.attendance_status),0) as student_present
                    from
                    student_attendance.student_attendance_master sam 
                    left join
                    dimensions.class cc  on sam.class_id = cc.class_id 
                    left join 
                    dimensions.district d on sam.district_id = d.district_id 
                    left join 
                    dimensions.block b on sam.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on sam.cluster_id  = c.cluster_id  
                    where 
                    sam.date between startDate and endDate   and sam.block_id = {block_id}
                    group by 
                    TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                    b.block_name,sam.cluster_id ,c.cluster_name,
                    d.district_name
                    ORDER BY
                    TO_CHAR(sam.date, 'YYYY-MM-DD')`
                },
                "level": "cluster"
            }
        },
        {
            "name": "Cluster",
            "labelProp": "cluster_name",
            "valueProp": "cluster_id",
            "hierarchyLevel": "4",
            "timeSeriesQueries": {
                "barChart": `select
                sam.district_id ,
                d.district_name,
                sam.block_id ,
                b.block_name,
                sam.cluster_id,
                c.cluster_name,
                sam.school_id ,
                sch.school_name,
                TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                coalesce(sum(sam.attendance_status),0) as student_present
                from
                student_attendance.student_attendance_master sam 
                left join
                dimensions.class cc  on sam.class_id = cc.class_id 
                left join 
                dimensions.district d on sam.district_id = d.district_id 
                left join 
                dimensions.block b on sam.block_id = b.block_id 
                left join 
                dimensions.cluster c on sam.cluster_id  = c.cluster_id  
                left join 
                dimensions.school sch on sam.school_id = sch.school_id 
                where 
                sam.date between startDate and endDate   and sam.cluster_id = {cluster_id}
                group by 
                TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                b.block_name,sam.cluster_id ,c.cluster_name,
                d.district_name,sam.school_id ,
                sch.school_name
                ORDER BY
                TO_CHAR(sam.date, 'YYYY-MM-DD')
                
                
            `,
            },
            "actions": {
                "queries": {
                    "barChart":`select
                    sam.district_id ,
                    d.district_name,
                    sam.block_id ,
                    b.block_name,
                    sam.cluster_id,
                    c.cluster_name,
                    sam.school_id ,
                    sch.school_name,
                    TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(sam.attendance_status),0) as student_present
                    from
                    student_attendance.student_attendance_master sam 
                    left join
                    dimensions.class cc  on sam.class_id = cc.class_id 
                    left join 
                    dimensions.district d on sam.district_id = d.district_id 
                    left join 
                    dimensions.block b on sam.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on sam.cluster_id  = c.cluster_id  
                    left join 
                    dimensions.school sch on sam.school_id = sch.school_id 
                    where 
                    sam.date between startDate and endDate   and sam.cluster_id = {cluster_id}
                    group by 
                    TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                    b.block_name,sam.cluster_id ,c.cluster_name,
                    d.district_name,sam.school_id ,
                    sch.school_name
                    ORDER BY
                    TO_CHAR(sam.date, 'YYYY-MM-DD')
                    
                `
                },
                "level": "school"
            }
        },

    ],
    "options": {
        "barChart": {
            "metricLabelProp": "Student Present",
            "metricValueProp": "student_present",
            "yAxis": {
                "title": "Student Present"
            },
            "benchmarkConfig": {
                "linkedReport": "tas_average_attendance_bignumber"
            },
            "xAxis": {
                "title": "Date",
                "label": "level",
                "value": "level",

            },
            "tooltipMetrics": [
                {
                    "valuePrefix": "District Id: ",
                    "value": "district_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "District Name: ",
                    "value": "district_name",
                    "valueSuffix": ""
                },
               
                {
                    "valuePrefix": "Block Id: ",
                    "value": "block_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Block Name: ",
                    "value": "block_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Cluster Id: ",
                    "value": "cluster_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Cluster Name: ",
                    "value": "cluster_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "School Id: ",
                    "value": "school_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Present Students ",
                    "value": "present_students",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Present Students ",
                    "value": "total_students",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "School Name: ",
                    "value": "school_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Average Percentage Student: ",
                    "value": "student_present",
                    "valueSuffix": ""
                },
                
                // {
                //     "valuePrefix": "Average percentage of LO: ",
                //     "value": "perc_lo",
                //     "valueSuffix": "%"
                // },
            ]
        }
    }
},



//absent queries
student_average_absent_school: {
    "label": "Average Student Present",
    "defaultLevel": "state",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "table": `
                select
ts.district_id,d.district_name,
ts.school_id,sch.school_name,
coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
coalesce( COUNT(ts.attendance_status), 0) AS total_students,
coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
from
student_attendance.student_attendance_master ts
LEFT JOIN
dimensions.school sch ON ts.school_id = sch.school_id
LEFT JOIN
dimensions.cluster c ON ts.cluster_id = c.cluster_id
LEFT JOIN
dimensions.block b ON ts.block_id = b.block_id
LEFT JOIN
dimensions.district d ON ts.district_id = d.district_id
LEFT JOIN
    dimensions.class cc ON ts.class_id = cc.class_id
JOIN
 (
  select ts.school_id,
  COUNT(DISTINCT ts.date) AS total_days
  FROM
   student_attendance.student_attendance_master ts
   join dimensions.class cc on cc.class_id = ts.class_id
   where 
     ts.date BETWEEN startDate AND endDate
   GROUP BY
   ts.school_id
    ) AS days_count ON ts.school_id = days_count.school_id
Where ts.date between startDate AND endDate 
GROUP BY
ts.district_id,d.district_name,
ts.school_id,sch.school_name,days_count.total_days `
            },
            "actions": {
                "queries": {
                    "table": `
                    select
ts.district_id,d.district_name,
ts.school_id,sch.school_name,
coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
coalesce( COUNT(ts.attendance_status), 0) AS total_students,
coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
from
student_attendance.student_attendance_master ts
LEFT JOIN
dimensions.school sch ON ts.school_id = sch.school_id
LEFT JOIN
dimensions.cluster c ON ts.cluster_id = c.cluster_id
LEFT JOIN
dimensions.block b ON ts.block_id = b.block_id
LEFT JOIN
dimensions.district d ON ts.district_id = d.district_id
LEFT JOIN
    dimensions.class cc ON ts.class_id = cc.class_id
JOIN
 (
  select ts.school_id,
  COUNT(DISTINCT ts.date) AS total_days
  FROM
   student_attendance.student_attendance_master ts
   join dimensions.class cc on cc.class_id = ts.class_id
   where 
     ts.date BETWEEN startDate AND endDate
   GROUP BY
   ts.school_id
    ) AS days_count ON ts.school_id = days_count.school_id
Where ts.date between startDate AND endDate 
GROUP BY
ts.district_id,d.district_name,
ts.school_id,sch.school_name,days_count.total_days`,
                },
                "level": "school"
            }
        },
        {
            "name": "District",
            "labelProp": "district_name",
            "valueProp": "district_id",
            "hierarchyLevel": "2",
            "timeSeriesQueries": {
                "table": `select
                b.district_id,d.district_name,
                ts.block_id,b.block_name,
                ts.school_id,sch.school_name,
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                from
                student_attendance.student_attendance_master ts
                LEFT JOIN
                dimensions.school sch ON ts.school_id = sch.school_id
                LEFT JOIN
                dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                    JOIN
                 (
                  select ts.school_id,
                  COUNT(DISTINCT ts.date) AS total_days
                  FROM
                   student_attendance.student_attendance_master ts
                   join dimensions.class cc on cc.class_id = ts.class_id
                   where 
                     ts.date BETWEEN startDate AND endDate
                   GROUP BY
                   ts.school_id
                    ) AS days_count ON ts.school_id = days_count.school_id
                where ts.date between startDate AND endDate AND b.district_id = {district_id}
                GROUP BY
                b.district_id,d.district_name,ts.block_id,b.block_name,
                ts.school_id,sch.school_name,days_count.total_days`
            },
            "actions": {
                "queries": {
                    "table": `select
                    b.district_id,d.district_name,
                    ts.block_id,b.block_name,
                    ts.school_id,sch.school_name,
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                    coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                    coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                    from
                    student_attendance.student_attendance_master ts
                    LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    LEFT JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                        JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       student_attendance.student_attendance_master ts
                       join dimensions.class cc on cc.class_id = ts.class_id
                       where 
                         ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    where ts.date between startDate AND endDate AND b.district_id = {district_id}
                    GROUP BY
                    b.district_id,d.district_name,ts.block_id,b.block_name,
                    ts.school_id,sch.school_name,days_count.total_days`,
                },
                "level": "school"
            }
        },
        {
            "name": "Block",
            "labelProp": "block_name",
            "valueProp": "block_id",
            "hierarchyLevel": "3",
            "timeSeriesQueries": {
                "table": `select
                b.district_id,d.district_name,
                c.block_id,b.block_name,
                c.cluster_id,c.cluster_name,
                ts.school_id,sch.school_name,
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                from
                student_attendance.student_attendance_master ts
                left JOIN
                dimensions.school sch ON ts.school_id = sch.school_id
                left JOIN
                dimensions.cluster c ON ts.cluster_id = c.cluster_id
                left JOIN
                dimensions.block b ON ts.block_id = b.block_id
                left JOIN
                dimensions.district d ON ts.district_id = d.district_id
                left JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                    JOIN
                 (
                  select ts.school_id,
                  COUNT(DISTINCT ts.date) AS total_days
                  FROM
                   student_attendance.student_attendance_master ts
                   join dimensions.class cc on cc.class_id = ts.class_id
                   where 
                     ts.date BETWEEN startDate AND endDate
                   GROUP BY
                   ts.school_id
                    ) AS days_count ON ts.school_id = days_count.school_id
                Where ts.date between startDate AND endDate  AND c.block_id = {block_id}
                GROUP BY
                b.district_id,d.district_name,
                c.block_id,b.block_name,
                c.cluster_id,c.cluster_name,
                ts.school_id,sch.school_name,days_count.total_days`
            },
            "actions": {
                "queries": {
                    "table": `select
                    b.district_id,d.district_name,
                    c.block_id,b.block_name,
                    ts.school_id,sch.school_name,
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                    coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                    coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                    from
                    student_attendance.student_attendance_master ts
                    left JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    left JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    left JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    left JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    left JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                        JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       student_attendance.student_attendance_master ts
                       join dimensions.class cc on cc.class_id = ts.class_id
                       where 
                         ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date between startDate AND endDate  AND c.block_id = {block_id}
                    GROUP BY
                    b.district_id,d.district_name,
                    c.block_id,b.block_name,
                    ts.school_id,sch.school_name,days_count.total_days 
`,
                },
                "level": "school"
            }
        },
        {
            "name": "Cluster",
            "labelProp": "cluster_name",
            "valueProp": "cluster_id",
            "hierarchyLevel": "4",
            "timeSeriesQueries": {
                "table":`select
                b.district_id,d.district_name,
                c.block_id,b.block_name,
                sch.cluster_id, c.cluster_name,
                ts.school_id,sch.school_name,
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                from
                student_attendance.student_attendance_master ts
                left JOIN
                dimensions.school sch ON ts.school_id = sch.school_id
                left JOIN
                dimensions.cluster c ON ts.cluster_id = c.cluster_id
                left JOIN
                dimensions.block b ON ts.block_id = b.block_id
                left JOIN
                dimensions.district d ON ts.district_id = d.district_id
                left JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                    JOIN
                 (
                  select ts.school_id,
                  COUNT(DISTINCT ts.date) AS total_days
                  FROM
                   student_attendance.student_attendance_master ts
                   join dimensions.class cc on cc.class_id = ts.class_id
                   where 
                
                   ts.date BETWEEN startDate AND endDate
                   GROUP BY
                   ts.school_id
                    ) AS days_count ON ts.school_id = days_count.school_id
                Where ts.date between startDate AND endDate AND sch.cluster_id = {cluster_id}
                GROUP BY
                b.district_id,d.district_name,
                c.block_id,b.block_name,
                sch.cluster_id, c.cluster_name,
                ts.school_id,sch.school_name,days_count.total_days`
            },
            "actions": {
                "queries": {
                    "table": `select
                    b.district_id,d.district_name,
                    c.block_id,b.block_name,
                    sch.cluster_id, c.cluster_name,
                    ts.school_id,sch.school_name,
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                    coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                    coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                    from
                    student_attendance.student_attendance_master ts
                    left JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    left JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    left JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    left JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    left JOIN
                        dimensions.class cc ON ts.class_id = cc.class_id
                        JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       student_attendance.student_attendance_master ts
                       join dimensions.class cc on cc.class_id = ts.class_id
                       where 
                    
                       ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date between startDate AND endDate AND sch.cluster_id = {cluster_id}
                    GROUP BY
                    b.district_id,d.district_name,
                    c.block_id,b.block_name,
                    sch.cluster_id, c.cluster_name,
                    ts.school_id,sch.school_name,days_count.total_days`,
                },
                "level": "school"
            }
        }
    ],
    "options": {
        "table": {
            "columns": [
                // {
                //     name: "Date",
                //     property: "ex_date",
                //     class: "text-left",
                //     type: "date",
                // },
                {
                    name: "District",
                    property: "district_name",
                    class: "text-center"
                },
                {
                    name: "Block",
                    property: "block_name",
                    class: "text-center"
                },
                {
                    name: "Cluster",
                    property: "cluster_name",
                    class: "text-center"
                },
                // {
                //     name: "UDISE Code",
                //     property: "udise_code",
                //     class: "text-left"
                // },
                {
                    name: "SCHOOL Code",
                    property: "school_id",
                    class: "text-center"
                },
                {
                    name: "School",
                    property: "school_name",
                    class: "text-center"
                },
                {
                    name: "Total Students",
                    property: "total_students",
                    class: "text-center"
                },
                {
                    name: "Total Students Absent",
                    property: "absent_students",
                    class: "text-center"
                },
                {
                    name: "% Absent Student",
                    property: "absent_students_percentage",
                    class: "text-center",
                    valueSuffix: '%',
                    isHeatMapRequired: true,
                    type: "number",
                    color: {
                        type: "percentage",
                        values: [
                            {
                                color: "#007000",
                                breakPoint: 70
                            },
                            {
                                color: "#FFBF00",
                                breakPoint: 40
                            },
                            {
                                color: "#D2222D",
                                breakPoint: 0
                            }
                        ]
                    },
                }
            ],
        },
        "searchBar_config": {
            "title": "School Code",
            "searchProps": ['school_id'],
            "searchType": "number"
        },
        
    }
},
student_absent_trendchart:{
    "label": "Overall Summary",
    "defaultLevel": "state",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "barChart": ` select 
                TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                coalesce((COUNT(sam.attendance_status) - SUM(sam.attendance_status)), 0) AS absent_students
                from
                student_attendance.student_attendance_master sam 
                left join
                dimensions.class cc  on sam.class_id = cc.class_id 
                where 
                sam.date between startDate and endDate
                GROUP BY
                TO_CHAR(sam.date, 'YYYY-MM-DD')
                order by
                TO_CHAR(sam.date, 'YYYY-MM-DD');
            
             
                `,
            },
            "actions": {
                "queries": {
                    "barChart":` select 
                    TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                    coalesce((COUNT(sam.attendance_status) - SUM(sam.attendance_status)), 0) AS absent_students
                    from
                    student_attendance.student_attendance_master sam 
                    left join
                    dimensions.class cc  on sam.class_id = cc.class_id 
                    where 
                    sam.date between startDate and endDate
                    GROUP BY
                    TO_CHAR(sam.date, 'YYYY-MM-DD')
                    order by
                    TO_CHAR(sam.date, 'YYYY-MM-DD');
                
                 
                    `
                
                },
                "level": "district"
            }
        },
        {
            "name": "District",
            "labelProp": "district_name",
            "valueProp": "district_id",
            "hierarchyLevel": "2",
            "timeSeriesQueries": {
                "barChart": `select
                sam.district_id ,
                d.district_name,
                sam.block_id ,
                b.block_name,
                TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                coalesce((COUNT(sam.attendance_status) - SUM(sam.attendance_status)), 0) AS absent_students
                from
                student_attendance.student_attendance_master sam 
                left join
                dimensions.class cc  on sam.class_id = cc.class_id 
                left join 
                dimensions.district d on sam.district_id = d.district_id 
                left join 
                dimensions.block b on sam.block_id = b.block_id 
                where 
                sam.date between startDate and endDate and sam.district_id = {district_id}
                group by 
                TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                b.block_name,
                d.district_name
                order by
                TO_CHAR(sam.date, 'YYYY-MM-DD');`,
            },
            "actions": {
                "queries": {
                    "barChart":
                    `select
                    sam.district_id ,
                    d.district_name,
                    sam.block_id ,
                    b.block_name,
                    TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                    coalesce((COUNT(sam.attendance_status) - SUM(sam.attendance_status)), 0) AS absent_students
                    from
                    student_attendance.student_attendance_master sam 
                    left join
                    dimensions.class cc  on sam.class_id = cc.class_id 
                    left join 
                    dimensions.district d on sam.district_id = d.district_id 
                    left join 
                    dimensions.block b on sam.block_id = b.block_id 
                    where 
                    sam.date between startDate and endDate and sam.district_id = {district_id}
                    group by 
                    TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                    b.block_name,
                    d.district_name
                    order by
                    TO_CHAR(sam.date, 'YYYY-MM-DD'); `,
                },
                "level": "block"
            }
        },
        {
            "name": "Block",
            "labelProp": "block_name",
            "valueProp": "block_id",
            "hierarchyLevel": "3",
            "timeSeriesQueries": {
                "barChart": `select
                sam.district_id ,
                d.district_name,
                sam.block_id ,
                b.block_name,
                sam.cluster_id,
                c.cluster_name,
                TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                coalesce((COUNT(sam.attendance_status) - SUM(sam.attendance_status)), 0) AS absent_students
                from
                student_attendance.student_attendance_master sam 
                left join
                dimensions.class cc  on sam.class_id = cc.class_id 
                left join 
                dimensions.district d on sam.district_id = d.district_id 
                left join 
                dimensions.block b on sam.block_id = b.block_id 
                left join 
                dimensions.cluster c on sam.cluster_id  = c.cluster_id  
                where 
                sam.date between startDate and endDate and sam.block_id = {block_id}
                group by 
                TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                b.block_name,sam.cluster_id ,c.cluster_name,
                d.district_name
                ORDER BY
                TO_CHAR(sam.date, 'YYYY-MM-DD')`,
            },
            "actions": {
                "queries": {
                    "barChart":`select
                    sam.district_id ,
                    d.district_name,
                    sam.block_id ,
                    b.block_name,
                    sam.cluster_id,
                    c.cluster_name,
                    TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                    coalesce((COUNT(sam.attendance_status) - SUM(sam.attendance_status)), 0) AS absent_students
                    from
                    student_attendance.student_attendance_master sam 
                    left join
                    dimensions.class cc  on sam.class_id = cc.class_id 
                    left join 
                    dimensions.district d on sam.district_id = d.district_id 
                    left join 
                    dimensions.block b on sam.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on sam.cluster_id  = c.cluster_id  
                    where 
                    sam.date between startDate and endDate and sam.block_id = {block_id}
                    group by 
                    TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                    b.block_name,sam.cluster_id ,c.cluster_name,
                    d.district_name
                    ORDER BY
                    TO_CHAR(sam.date, 'YYYY-MM-DD')`
                },
                "level": "cluster"
            }
        },
        {
            "name": "Cluster",
            "labelProp": "cluster_name",
            "valueProp": "cluster_id",
            "hierarchyLevel": "4",
            "timeSeriesQueries": {
                "barChart": `select
                sam.district_id ,
                d.district_name,
                sam.block_id ,
                b.block_name,
                sam.cluster_id,
                c.cluster_name,
                sam.school_id ,
                sch.school_name,
                TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                coalesce((COUNT(sam.attendance_status) - SUM(sam.attendance_status)), 0) AS absent_students
                from
                student_attendance.student_attendance_master sam 
                left join
                dimensions.class cc  on sam.class_id = cc.class_id 
                left join 
                dimensions.district d on sam.district_id = d.district_id 
                left join 
                dimensions.block b on sam.block_id = b.block_id 
                left join 
                dimensions.cluster c on sam.cluster_id  = c.cluster_id  
                left join 
                dimensions.school sch on sam.school_id = sch.school_id 
                where 
                sam.date between startDate and endDate and sam.cluster_id = {cluster_id}
                group by 
                TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                b.block_name,sam.cluster_id ,c.cluster_name,
                d.district_name,sam.school_id ,
                sch.school_name
                ORDER BY
                TO_CHAR(sam.date, 'YYYY-MM-DD')
                
                
            `,
            },
            "actions": {
                "queries": {
                    "barChart":`select
                    sam.district_id ,
                    d.district_name,
                    sam.block_id ,
                    b.block_name,
                    sam.cluster_id,
                    c.cluster_name,
                    sam.school_id ,
                    sch.school_name,
                    TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
                    coalesce((COUNT(sam.attendance_status) - SUM(sam.attendance_status)), 0) AS absent_students
                    from
                    student_attendance.student_attendance_master sam 
                    left join
                    dimensions.class cc  on sam.class_id = cc.class_id 
                    left join 
                    dimensions.district d on sam.district_id = d.district_id 
                    left join 
                    dimensions.block b on sam.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on sam.cluster_id  = c.cluster_id  
                    left join 
                    dimensions.school sch on sam.school_id = sch.school_id 
                    where 
                    sam.date between startDate and endDate and sam.cluster_id = {cluster_id}
                    group by 
                    TO_CHAR(sam.date, 'YYYY-MM-DD'),sam.district_id ,sam.block_id ,
                    b.block_name,sam.cluster_id ,c.cluster_name,
                    d.district_name,sam.school_id ,
                    sch.school_name
                    ORDER BY
                    TO_CHAR(sam.date, 'YYYY-MM-DD')
                    
                `
                },
                "level": "school"
            }
        },

    ],
    "options": {
        "barChart": {
            "metricLabelProp": "Student Absent",
            "metricValueProp": "absent_students",
            "yAxis": {
                "title": "Student Absent"
            },
            "benchmarkConfig": {
                "linkedReport": "tas_average_attendance_bignumber"
            },
            "xAxis": {
                "title": "Date",
                "label": "level",
                "value": "level",

            },
            "tooltipMetrics": [
                {
                    "valuePrefix": "District Id: ",
                    "value": "district_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "District Name: ",
                    "value": "district_name",
                    "valueSuffix": ""
                },
               
                {
                    "valuePrefix": "Block Id: ",
                    "value": "block_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Block Name: ",
                    "value": "block_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Cluster Id: ",
                    "value": "cluster_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Cluster Name: ",
                    "value": "cluster_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "School Id: ",
                    "value": "school_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Present Students ",
                    "value": "present_students",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Present Students ",
                    "value": "total_students",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "School Name: ",
                    "value": "school_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Average Percentage Student: ",
                    "value": "student_present",
                    "valueSuffix": ""
                },
                
                // {
                //     "valuePrefix": "Average percentage of LO: ",
                //     "value": "perc_lo",
                //     "valueSuffix": "%"
                // },
            ]
        }
    }
},
student_absent_barchart:{
    "label": "Overall Summary",
    "defaultLevel": "state",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "barChart": `SELECT 
                ts.district_id,
                d.district_name as level,
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS perc_absent
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate  
            GROUP BY
                ts.district_id, d.district_name;
                `,
            },
            "actions": {
                "queries": {
                    "barChart":`SELECT 
                    ts.district_id,
                    d.district_name as level,
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS perc_absent
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate  
                GROUP BY
                    ts.district_id, d.district_name;
                    `
                
                },
                "level": "district"
            }
        },
        {
            "name": "District",
            "labelProp": "district_name",
            "valueProp": "district_id",
            "hierarchyLevel": "2",
            "timeSeriesQueries": {
                "barChart": `SELECT
                ts.block_id,
                b.block_name as level,
                
               coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS perc_absent
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.block b ON ts.block_id = b.block_id
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate   AND b.district_id = {district_id}
            GROUP BY
                ts.block_id,
                b.block_name; `,
            },
            "actions": {
                "queries": {
                    "barChart":
                    `SELECT
                    ts.block_id,
                    b.block_name as level,
                    
                   coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS perc_absent
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate   AND b.district_id = {district_id}
                GROUP BY
                    ts.block_id,
                    b.block_name; `,
                },
                "level": "block"
            }
        },
        {
            "name": "Block",
            "labelProp": "block_name",
            "valueProp": "block_id",
            "hierarchyLevel": "3",
            "timeSeriesQueries": {
                "barChart": `SELECT
                ts.cluster_id,
                c.cluster_name as level,
                
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS perc_absent
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.cluster c ON ts.cluster_id = c.cluster_id
            LEFT JOIN
                dimensions.block b ON ts.block_id = b.block_id
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate   AND c.block_id = {block_id}
            GROUP BY
                ts.cluster_id,
                c.cluster_name
                ;`,
            },
            "actions": {
                "queries": {
                    "barChart":`SELECT
                    ts.cluster_id,
                    c.cluster_name as level,
                    
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS perc_absent
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate   AND c.block_id = {block_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name
                    ;`
                },
                "level": "cluster"
            }
        },
        {
            "name": "Cluster",
            "labelProp": "cluster_name",
            "valueProp": "cluster_id",
            "hierarchyLevel": "4",
            "timeSeriesQueries": {
                "barChart": `SELECT
                ts.school_id,
                sch.school_name as level,
                
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS perc_absent
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.school sch ON ts.school_id = sch.school_id
            LEFT JOIN
                dimensions.cluster c ON ts.cluster_id = c.cluster_id
            LEFT JOIN
                dimensions.block b ON ts.block_id = b.block_id
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate   AND ts.cluster_id = {cluster_id}
            GROUP BY
               ts.school_id,
                sch.school_name
                ;
            
            
            
            
            `,
            },
            "actions": {
                "queries": {
                    "barChart":`SELECT
                    ts.school_id,
                    sch.school_name as level,
                    
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS perc_absent
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate   AND ts.cluster_id = {cluster_id}
                GROUP BY
                   ts.school_id,
                    sch.school_name
                    ;
                
                
                
                
                `
                },
                "level": "school"
            }
        },

    ],
    "options": {
        "barChart": {
            "metricLabelProp": "Percentage",
            "metricValueProp": "perc_absent",
            "yAxis": {
                "title": "Average Percentage"
            },
            "benchmarkConfig": {
                "linkedReport": "tas_average_attendance_bignumber"
            },
            "xAxis": {
                "title": "District",
                "label": "level",
                "value": "level",

            },
            "tooltipMetrics": [
                {
                    "valuePrefix": "District Id: ",
                    "value": "district_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "District Name: ",
                    "value": "district_name",
                    "valueSuffix": ""
                },
               
                {
                    "valuePrefix": "Block Id: ",
                    "value": "block_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Block Name: ",
                    "value": "block_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Cluster Id: ",
                    "value": "cluster_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Cluster Name: ",
                    "value": "cluster_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "School Id: ",
                    "value": "school_id",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Present Students ",
                    "value": "present_students",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Present Students ",
                    "value": "total_students",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "School Name: ",
                    "value": "school_name",
                    "valueSuffix": ""
                },
                {
                    "valuePrefix": "Average Percentage Student: ",
                    "value": "perc_students",
                    "valueSuffix": ""
                },
                
                // {
                //     "valuePrefix": "Average percentage of LO: ",
                //     "value": "perc_lo",
                //     "valueSuffix": "%"
                // },
            ]
        }
    }
},
student_average_absent_bignumber: {
    "label": "Average Student Present",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "bigNumber": `  SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
                from (SELECT 
                ts.district_id,
                d.district_name,
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate  
            GROUP BY
                ts.district_id, d.district_name) AS avg_query;`

            },
            "actions": {
                "queries": {
                    "bigNumber": `  SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
                    from (SELECT 
                    ts.district_id,
                    d.district_name,
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate  
                GROUP BY
                    ts.district_id, d.district_name) AS avg_query;`
                },
                "level": "district"
            }
        },
        {
            "name": "District",
            "labelProp": "district_name",
            "valueProp": "district_id",
            "hierarchyLevel": "2",
            "timeSeriesQueries": {
                "bigNumber": `SELECT 
                ROUND(AVG(absent_students_percentage)) AS percentage_students
                from (SELECT 
                ts.district_id,
                d.district_name,
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate   AND ts.district_id ={district_id}
            GROUP BY
                ts.district_id, d.district_name) AS avg_query;`
            },
            "actions": {
                "queries": {
                    "bigNumber": `SELECT 
                    ROUND(AVG(absent_students_percentage)) AS percentage_students
                    from (SELECT 
                    ts.district_id,
                    d.district_name,
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate   AND ts.district_id ={district_id}
                GROUP BY
                    ts.district_id, d.district_name) AS avg_query;`
                },
                "level": "block"
            }
        },
       
        {
            "name": "Block",
            "labelProp": "block_name",
            "valueProp": "block_id",
            "hierarchyLevel": "3",
            "timeSeriesQueries": {
                "bigNumber": `SELECT 
                ROUND(AVG(absent_students_percentage)) AS percentage_students
                from (SELECT
                ts.block_id,
                b.block_name,
                ts.district_id,
                d.district_name,
               coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.block b ON ts.block_id = b.block_id
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate   AND ts.block_id = {block_id}
            GROUP BY
                ts.block_id,
                b.block_name,ts.district_id, d.district_name) AS avg_query;
                `,
                
            },
            "actions": {
                "queries": {
                    "bigNumber": `SELECT 
                    ROUND(AVG(absent_students_percentage)) AS percentage_students
                    from (SELECT
                    ts.block_id,
                    b.block_name,
                    ts.district_id,
                    d.district_name,
                   coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate   AND ts.block_id = {block_id}
                GROUP BY
                    ts.block_id,
                    b.block_name,ts.district_id, d.district_name) AS avg_query;
                    `,
                   
                },
                "level": "cluster"
            }
        },
        {
            "name": "Cluster",
            "labelProp": "cluster_name",
            "valueProp": "cluster_id",
            "hierarchyLevel": "4",
            "timeSeriesQueries": {
                "bigNumber": `SELECT 
                ROUND(AVG(absent_students_percentage)) AS percentage_students
                from (SELECT
                ts.cluster_id,
                c.cluster_name,
                ts.block_id,
                b.block_name,
                ts.district_id,
                d.district_name,
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.cluster c ON ts.cluster_id = c.cluster_id
            LEFT JOIN
                dimensions.block b ON ts.block_id = b.block_id
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate   AND ts.cluster_id = {cluster_id}
            GROUP BY
                ts.cluster_id,
                c.cluster_name,
                ts.block_id,
                b.block_name,ts.district_id, d.district_name) AS avg_query;
                    
                `,
               
            },
            "actions": {
                "queries": {
                    "bigNumber": `SELECT 
                    ROUND(AVG(absent_students_percentage)) AS percentage_students
                    from (SELECT
                    ts.cluster_id,
                    c.cluster_name,
                    ts.block_id,
                    b.block_name,
                    ts.district_id,
                    d.district_name,
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate   AND ts.cluster_id = {cluster_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name,
                    ts.block_id,
                    b.block_name,ts.district_id, d.district_name) AS avg_query;
                        
                `,
                    
                },
                "level": "school"
            }
        }
    ],
    "options": {
        "bigNumber": {
            "title": "Average Present",
            "valueSuffix": '%',
            "property": 'percentage_students'
        }
    }
},
student_average_absent_table: {
    "label": "Average Student Present",
    "defaultLevel": "state",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "table": `SELECT 
                ts.district_id,
                d.district_name,
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate  
            GROUP BY
                ts.district_id, d.district_name;`,
            },
            "actions": {
                "queries": {
                    "table": `SELECT 
                    ts.district_id,
                    d.district_name,
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate  
                GROUP BY
                    ts.district_id, d.district_name;`,
                },
                "level": "district"
            }
        },
        {
            "name": "District",
            "labelProp": "district_name",
            "valueProp": "district_id",
            "hierarchyLevel": "2",
            "timeSeriesQueries": {
                "table": `SELECT
                ts.block_id,
                b.block_name,
                
               coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.block b ON ts.block_id = b.block_id
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate   AND b.district_id = {district_id}
            GROUP BY
                ts.block_id,
                b.block_name;`,
            },
            "actions": {
                "queries": {
                    "table": `SELECT
                    ts.block_id,
                    b.block_name,
                    
                   coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate   AND b.district_id = {district_id}
                GROUP BY
                    ts.block_id,
                    b.block_name;`,
                },
                "level": "block"
            }
        },
        {
            "name": "Block",
            "labelProp": "block_name",
            "valueProp": "block_id",
            "hierarchyLevel": "3",
            "timeSeriesQueries": {
                "table": `SELECT
                ts.cluster_id,
                c.cluster_name,
                
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.cluster c ON ts.cluster_id = c.cluster_id
            LEFT JOIN
                dimensions.block b ON ts.block_id = b.block_id
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate   AND c.block_id = {block_id}
            GROUP BY
                ts.cluster_id,
                c.cluster_name
                ;`,
            },
            "actions": {
                "queries": {
                    "table": `SELECT
                    ts.cluster_id,
                    c.cluster_name,
                    
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate   AND c.block_id = {block_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name
                    ;`,
                },
                "level": "cluster"
            }
        },
        {
            "name": "Cluster",
            "labelProp": "cluster_name",
            "valueProp": "cluster_id",
            "hierarchyLevel": "4",
            "timeSeriesQueries": {
                "table": `SELECT
                ts.school_id,
                sch.school_name,
                
                coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
               coalesce( COUNT(ts.attendance_status), 0) AS total_students,
               coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
            FROM
                student_attendance.student_attendance_master ts
            LEFT JOIN
                dimensions.school sch ON ts.school_id = sch.school_id
            LEFT JOIN
                dimensions.cluster c ON ts.cluster_id = c.cluster_id
            LEFT JOIN
                dimensions.block b ON ts.block_id = b.block_id
            LEFT JOIN
                dimensions.district d ON ts.district_id = d.district_id
            LEFT JOIN
                dimensions.class cc ON ts.class_id = cc.class_id
            WHERE
                ts.date BETWEEN startDate AND endDate   AND ts.cluster_id = {cluster_id}
            GROUP BY
               ts.school_id,
                sch.school_name
                ;
            
            
            
            
            
                `
            },
            "actions": {
                "queries": {
                    "table": `SELECT
                    ts.school_id,
                    sch.school_name,
                    
                    coalesce((COUNT(ts.attendance_status) - SUM(ts.attendance_status)), 0) AS absent_students,
                   coalesce( COUNT(ts.attendance_status), 0) AS total_students,
                   coalesce(ROUND((COUNT(ts.attendance_status) - SUM(ts.attendance_status)) * 100.0 / COUNT(ts.attendance_status), 2), 0) AS absent_students_percentage
                FROM
                    student_attendance.student_attendance_master ts
                LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                LEFT JOIN
                    dimensions.class cc ON ts.class_id = cc.class_id
                WHERE
                    ts.date BETWEEN startDate AND endDate   AND ts.cluster_id = {cluster_id}
                GROUP BY
                   ts.school_id,
                    sch.school_name
                    ;
                
                
                
                
                    `,
                },
                "level": "school"
            }
        },
        // {
        //     "name": "School",
        //     "labelProp": "school_name",
        //     "valueProp": "school_id",
        //     "hierarchyLevel": "5",
        //     "timeSeriesQueries": {
        //         "table": "select grade_number, ceil(round(CAST(COALESCE(avg(a.teachers_present/NULLIF(a.teachers_marked, 0))*100) as numeric),2)) as perc_teachers from  (select present_table.grade_state, present_table.school_id,present_table.date as att_date,present_table.sum as teachers_present,marked_table.sum as teachers_marked from datasets.sch_att_teacherspresent_daily_gender0school0grade as present_table join datasets.sch_att_teachersmarked_daily_gender0school0grade as marked_table on present_table.date = marked_table.date and present_table.school_id = marked_table.school_id and present_table.grade_state = marked_table.grade_state) as a join dimensions.grade as grade_wise_table on grade_wise_table.grade_id = a.grade_state where school_id = {school_id} and a.att_date between startDate and endDate group by a.grade_state, grade_number order by perc_teachers asc",
        //     },
        //     "actions": {
        //         "queries": {
        //             "table": "select min(date) as min_date, max(date) as max_date, t.grade, school_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_avg_atd_by_grade as t left join ingestion.dimension_master as m on t.school_id = m.school_id left join ingestion.dimension_district as d on d.district_id = m.district_id left join ingestion.dimension_block as b on b.block_id = m.block_id left join ingestion.dimension_cluster as c on c.cluster_id = m.cluster_id left join ingestion.dimension_school as s on s.school_id = t.school_id where t.school_id={school_id} group by t.grade, school_name,cluster_name,block_name,district_name",
        //         },
        //         "level": "school"
        //     }
        // }
    ],
    "options": {
        "table": {
            "columns": [
                {
                    name: "State",
                    property: "state_name",
                    class: "text-left",
                    action: {
                        dataProps: [{
                            "prop": "state_id",
                            "alias": "id"
                        }, {
                            "prop": "state_name"
                        }],
                        extraInfo: {
                            hierarchyLevel: 1,
                            linkedReports: ["student_average_absent_bignumber", "student_average_absent_school","student_absent_barchart","student_absent_trendchart"]
                        },
                        allowedLevels: [1, 2, 3]
                    }
                },
                {
                    name: "District",
                    property: "district_name",
                    class: "text-left",
                    action: {
                        dataProps: [{
                            "prop": "district_id",
                            "alias": "id"
                        }, {
                            "prop": "district_name"
                        }],
                        extraInfo: {
                            hierarchyLevel: 2,
                            linkedReports: ["student_average_absent_bignumber", "student_average_absent_school","student_absent_barchart","student_absent_trendchart"]                            },
                        allowedLevels: [1, 2, 3]
                    }
                },
                {
                    name: "Block",
                    property: "block_name",
                    class: "text-left",
                    action: {
                        dataProps: [{
                            "prop": "block_id",
                            "alias": "id"
                        }, {
                            "prop": "block_name"
                        }],
                        extraInfo: {
                            hierarchyLevel: 3,
                            linkedReports: ["student_average_absent_bignumber", "student_average_absent_school","student_absent_barchart","student_absent_trendchart"]                            },
                        allowedLevels: [1, 2, 3]
                    }
                },
                {
                    name: "Cluster",
                    property: "cluster_name",
                    class: "text-left",
                    action: {
                        dataProps: [{
                            "prop": "cluster_id",
                            "alias": "id"
                        }, {
                            "prop": "cluster_name"
                        }],
                        extraInfo: {
                            hierarchyLevel: 4,
                            linkedReports: ["student_average_absent_bignumber", "student_average_absent_school","student_absent_barchart","student_absent_trendchart"]                            },
                        allowedLevels: [1, 2, 3]

                    }
                },
                {
                    name: "School",
                    property: "school_name",
                    class: "text-left"
                },
                {
                    name: "Grade",
                    property: "grade_number",
                    class: "text-center"
                },
                {
                    name: "% Average Absent",
                    property: "absent_students_percentage",
                    class: "text-center",
                    valueSuffix: '%',
                    isHeatMapRequired: true,
                    type: "number",
                    color: {
                        type: "percentage",
                        values: [
                            {
                                color: "#007000",
                                breakPoint: 70
                            },
                            {
                                color: "#FFBF00",
                                breakPoint: 40
                            },
                            {
                                color: "#D2222D",
                                breakPoint: 0
                            }
                        ]
                    },
                }
            ],
        },
        "bigNumber": {
            "valueSuffix": '%',
            "property": 'perc_teachers'
        }
    }
},

}
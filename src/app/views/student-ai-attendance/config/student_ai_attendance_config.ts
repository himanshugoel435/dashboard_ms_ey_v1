
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
                `SELECT 
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_students) / dc.total_days, 2) AS percentage_of_student_present,
   ROUND(SUM(smd.total_students) / dc.total_days) AS total_students,
   ROUND(SUM(smd.absent_students) / dc.total_days, 2) AS percentage_of_students_absent,
   ROUND((SUM(smd.present_students) * 100.0) / SUM(smd.total_students), 2) AS perc_students, 
   ROUND((SUM(smd.absent_students) * 100.0) / SUM(smd.total_students), 2) AS absent_students_percentage
FROM 
   student_attendance.stud_map_dis AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_map_dis
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN startDate AND endDate
GROUP BY 
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   dc.total_days;
  `,},
			"actions": {
				"queries":	
				{
					"map": 
                    `SELECT 
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_students) / dc.total_days, 2) AS percentage_of_student_present,
   ROUND(SUM(smd.total_students) / dc.total_days) AS total_students,
   ROUND(SUM(smd.absent_students) / dc.total_days, 2) AS percentage_of_students_absent,
   ROUND((SUM(smd.present_students) * 100.0) / SUM(smd.total_students), 2) AS perc_students, 
   ROUND((SUM(smd.absent_students) * 100.0) / SUM(smd.total_students), 2) AS absent_students_percentage
FROM 
   student_attendance.stud_map_dis AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_map_dis
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN startDate AND endDate
GROUP BY 
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   dc.total_days;
  `,

			
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
                      SELECT 
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_students) / dc.total_days, 2) AS percentage_of_student_present,
   ROUND(SUM(smd.total_students) / dc.total_days) AS total_students,
   ROUND(SUM(smd.absent_students) / dc.total_days, 2) AS percentage_of_students_absent,
   ROUND((SUM(smd.present_students) * 100.0) / SUM(smd.total_students), 2) AS perc_students, 
   ROUND((SUM(smd.absent_students) * 100.0) / SUM(smd.total_students), 2) AS absent_students_percentage
FROM 
   student_attendance.stud_map_block AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_map_block
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN startDate AND endDate and smd.district_id = {district_id}
GROUP BY 
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   dc.total_days;
                    `,

                    
                },
            "actions": {
                "queries":
                {
                    "map": `
                      SELECT 
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_students) / dc.total_days, 2) AS percentage_of_student_present,
   ROUND(SUM(smd.total_students) / dc.total_days) AS total_students,
   ROUND(SUM(smd.absent_students) / dc.total_days, 2) AS percentage_of_students_absent,
   ROUND((SUM(smd.present_students) * 100.0) / SUM(smd.total_students), 2) AS perc_students, 
   ROUND((SUM(smd.absent_students) * 100.0) / SUM(smd.total_students), 2) AS absent_students_percentage
FROM 
   student_attendance.stud_map_block AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_map_block
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN startDate AND endDate and smd.district_id = {district_id}
GROUP BY 
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   dc.total_days;
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
                "map": `SELECT 
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_students) / dc.total_days, 2) AS percentage_of_student_present,
   ROUND(SUM(smd.total_students) / dc.total_days) AS total_students,
   ROUND(SUM(smd.absent_students) / dc.total_days, 2) AS percentage_of_students_absent,
   ROUND((SUM(smd.present_students) * 100.0) / SUM(smd.total_students), 2) AS perc_students, 
   ROUND((SUM(smd.absent_students) * 100.0) / SUM(smd.total_students), 2) AS absent_students_percentage
FROM 
   student_attendance.stud_map_cluster AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_map_cluster
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN startDate AND endDate and smd.block_id = {block_id}
GROUP BY 
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   dc.total_days;`,

            },
            "actions": {
                "queries":
                {
                    "map": `SELECT 
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_students) / dc.total_days, 2) AS percentage_of_student_present,
   ROUND(SUM(smd.total_students) / dc.total_days) AS total_students,
   ROUND(SUM(smd.absent_students) / dc.total_days, 2) AS percentage_of_students_absent,
   ROUND((SUM(smd.present_students) * 100.0) / SUM(smd.total_students), 2) AS perc_students, 
   ROUND((SUM(smd.absent_students) * 100.0) / SUM(smd.total_students), 2) AS absent_students_percentage
FROM 
   student_attendance.stud_map_cluster AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_map_cluster
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN startDate AND endDate and smd.block_id = {block_id}
GROUP BY 
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   dc.total_days; `,

                },
                "level": "cluster",
                "nextLevel": "school"
            }
        },
         {
                    "name": "Cluster",
                    "hierarchyLevel": "4",
                    "timeSeriesQueries": {
                        "map": `SELECT 
   smd.school_id,
   smd.school_name,
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_students) / dc.total_days, 2) AS percentage_of_student_present,
   ROUND(SUM(smd.total_students) / dc.total_days) AS total_students,
   ROUND(SUM(smd.absent_students) / dc.total_days, 2) AS percentage_of_students_absent,
   ROUND((SUM(smd.present_students) * 100.0) / SUM(smd.total_students), 2) AS perc_students, 
   ROUND((SUM(smd.absent_students) * 100.0) / SUM(smd.total_students), 2) AS absent_students_percentage
FROM 
   student_attendance.stud_map_school AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_map_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN startDate AND endDate and smd.cluster_id = {cluster_id}
GROUP BY 
   smd.school_id,
   smd.school_name,
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   dc.total_days;`,},
                    "actions": {
                        "queries": {
                            "map": `SELECT 
   smd.school_id,
   smd.school_name,
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_students) / dc.total_days, 2) AS percentage_of_student_present,
   ROUND(SUM(smd.total_students) / dc.total_days) AS total_students,
   ROUND(SUM(smd.absent_students) / dc.total_days, 2) AS percentage_of_students_absent,
   ROUND((SUM(smd.present_students) * 100.0) / SUM(smd.total_students), 2) AS perc_students, 
   ROUND((SUM(smd.absent_students) * 100.0) / SUM(smd.total_students), 2) AS absent_students_percentage
FROM 
   student_attendance.stud_map_school AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_map_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN startDate AND endDate and smd.cluster_id = {cluster_id}
GROUP BY 
   smd.school_id,
   smd.school_name,
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   dc.total_days;
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
                    "table": `select 
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_dis sad  
where 
date BETWEEN startDate AND endDate
group by
district_id,
district_name,
present_students,
total_students`,
                },
                "actions": {
                    "queries": {
                        "table": `select 
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_dis sad  
where 
date BETWEEN startDate AND endDate
group by
district_id,
district_name,
present_students,
total_students`,
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
                    "table": `select 
block_id,
block_name,
district_id,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_block sad  
where 
date BETWEEN startDate AND endDate and district_id= {district_id}
group by
block_id,
block_name,
district_id,
present_students,
total_students
`,
                },
                "actions": {
                    "queries": {
                        "table": `select 
block_id,
block_name,
district_id,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_block sad  
where 
date BETWEEN startDate AND endDate and district_id= {district_id}
group by
block_id,
block_name,
district_id,
present_students,
total_students
`,
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
                    "table": `select 
 cluster_id,
 cluster_name,
block_id,
district_id,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_cluster sac  
where 
date BETWEEN startDate AND endDate and block_id= {block_id}
group by
cluster_id,
cluster_name,
block_id,
district_id,
present_students,
total_students`,
                },
                "actions": {
                    "queries": {
                        "table": `select 
 cluster_id,
 cluster_name,
block_id,
district_id,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_cluster sac  
where 
date BETWEEN startDate AND endDate and block_id= {block_id}
group by
cluster_id,
cluster_name,
block_id,
district_id,
present_students,
total_students`,
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
                    "table": `select 
 school_id,
 school_name,
 cluster_id,
block_id,
district_id,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_school sas  
where 
date BETWEEN startDate AND endDate and cluster_id= {cluster_id}
group by
school_id,
school_name,
cluster_id,
block_id,
district_id,
present_students,
total_students`
                },
                "actions": {
                    "queries": {
                        "table": `select 
 school_id,
 school_name,
 cluster_id,
block_id,
district_id,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_school sas  
where 
date BETWEEN startDate AND endDate and cluster_id= {cluster_id}
group by
school_id,
school_name,
cluster_id,
block_id,
district_id,
present_students,
total_students`,
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
                    "bigNumber": `select ROUND(AVG(perc_students)) AS percentage_students
from (select 
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_dis sad  
where 
date BETWEEN startDate AND endDate
group by
district_id,
district_name,
present_students,
total_students) AS avg_query;`

                },
                "actions": {
                    "queries": {
                        "bigNumber": `select ROUND(AVG(perc_students)) AS percentage_students
from (select 
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_dis sad  
where 
date BETWEEN startDate AND endDate
group by
district_id,
district_name,
present_students,
total_students) AS avg_query;`
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
                    "bigNumber": `select ROUND(AVG(perc_students)) AS percentage_students
from (select 
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_dis sad  
where 
date BETWEEN startDate AND endDate and district_id = {district_id}
group by
district_id,
district_name,
present_students,
total_students) AS avg_query;`
                },
                "actions": {
                    "queries": {
                        "bigNumber": `select ROUND(AVG(perc_students)) AS percentage_students
from (select 
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_dis sad  
where 
date BETWEEN startDate AND endDate and district_id = {district_id}
group by
district_id,
district_name,
present_students,
total_students) AS avg_query;`
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
                    "bigNumber": `select ROUND(AVG(perc_students)) AS percentage_students
from (select 
block_id,
block_name,
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_block sad  
where 
date BETWEEN startDate AND endDate and block_id = {block_id}
group by
block_id,
block_name,
district_id,
district_name,
present_students,
total_students) as avg_query;`,
                    
                },
                "actions": {
                    "queries": {
                        "bigNumber": `select ROUND(AVG(perc_students)) AS percentage_students
from (select 
block_id,
block_name,
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_block sad  
where 
date BETWEEN startDate AND endDate and block_id = {block_id}
group by
block_id,
block_name,
district_id,
district_name,
present_students,
total_students) as avg_query;`,
                       
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
                    "bigNumber": `select ROUND(AVG(perc_students)) AS percentage_students
from (select 
cluster_id,
cluster_name,
block_id,
block_name,
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_cluster sac 
where 
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
group by
cluster_id,
cluster_name,
block_id,
block_name,
district_id,
district_name,
present_students,
total_students) as avg_query;`,
                   
                },
                "actions": {
                    "queries": {
                        "bigNumber": `select ROUND(AVG(perc_students)) AS percentage_students
from (select 
cluster_id,
cluster_name,
block_id,
block_name,
district_id,
district_name,
sum_attendance as present_students,
count_attendance as total_students,
ROUND((sum_attendance *100) / count_attendance, 2) as perc_students
from
student_attendance.stud_avg_cluster sac 
where 
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
group by
cluster_id,
cluster_name,
block_id,
block_name,
district_id,
district_name,
present_students,
total_students) as avg_query`,
                        
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

    //bottom table for all data-- Average student present
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
                    "table": `SELECT 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   ROUND(SUM(ts.sum_attendance) / dc.total_days, 2) AS present_students,
   ROUND(SUM(ts.count_attendance) / dc.total_days, 2) AS total_students,
   ROUND((SUM(ts.sum_attendance) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`
                },
                "actions": {
                    "queries": {
                        "table": `SELECT 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   ROUND(SUM(ts.sum_attendance) / dc.total_days, 2) AS present_students,
   ROUND(SUM(ts.count_attendance) / dc.total_days, 2) AS total_students,
   ROUND((SUM(ts.sum_attendance) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`,
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
                    "table": ` SELECT 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   ROUND(SUM(ts.sum_attendance) / dc.total_days, 2) AS present_students,
   ROUND(SUM(ts.count_attendance) / dc.total_days, 2) AS total_students,
   ROUND((SUM(ts.sum_attendance) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.district_id = {district_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`
                },
                "actions": {
                    "queries": {
                        "table": ` SELECT 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   ROUND(SUM(ts.sum_attendance) / dc.total_days, 2) AS present_students,
   ROUND(SUM(ts.count_attendance) / dc.total_days, 2) AS total_students,
   ROUND((SUM(ts.sum_attendance) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.district_id = {district_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`,
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
                    "table": `SELECT 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.school_id,
   ts.school_name,
   ROUND(SUM(ts.sum_attendance) / dc.total_days, 2) AS present_students,
   ROUND(SUM(ts.count_attendance) / dc.total_days, 2) AS total_students,
   ROUND((SUM(ts.sum_attendance) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.block_id = {block_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`
                },
                "actions": {
                    "queries": {
                        "table": `SELECT 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.school_id,
   ts.school_name,
   ROUND(SUM(ts.sum_attendance) / dc.total_days, 2) AS present_students,
   ROUND(SUM(ts.count_attendance) / dc.total_days, 2) AS total_students,
   ROUND((SUM(ts.sum_attendance) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.block_id = {block_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`,
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
                    "table":` SELECT 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.cluster_id,
   ts.cluster_name,
   ts.school_id,
   ts.school_name,
   ROUND(SUM(ts.sum_attendance) / dc.total_days, 2) AS present_students,
   ROUND(SUM(ts.count_attendance) / dc.total_days, 2) AS total_students,
   ROUND((SUM(ts.sum_attendance) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.cluster_id = {cluster_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.cluster_id,
   ts.cluster_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`
                },
                "actions": {
                    "queries": {
                        "table": ` SELECT 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.cluster_id,
   ts.cluster_name,
   ts.school_id,
   ts.school_name,
   ROUND(SUM(ts.sum_attendance) / dc.total_days, 2) AS present_students,
   ROUND(SUM(ts.count_attendance) / dc.total_days, 2) AS total_students,
   ROUND((SUM(ts.sum_attendance) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.cluster_id = {cluster_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.cluster_id,
   ts.cluster_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`,
                    },
                    "level": "school"
                }
            }
        ],
        "options": {
            "table": {
                "columns": [
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

// Average Student present--> average,max and min ( above school table)
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
                "barChart": `select 
district_id,
district_name as level,
sum(sum_attendance) as present_students,
sum(count_attendance) as total_students,
ROUND(SUM(sum_attendance) * 100 / sum(count_attendance), 2) as perc_students
from
student_attendance.stud_avg_dis
 WHERE
date BETWEEN startDate AND endDate 
GROUP BY
district_id, district_name;
                `,
            },
            "actions": {
                "queries": {
                    "barChart":`select 
district_id,
district_name as level,
sum(sum_attendance) as present_students,
sum(count_attendance) as total_students,
ROUND(SUM(sum_attendance) * 100 / sum(count_attendance), 2) as perc_students
from
student_attendance.stud_avg_dis
 WHERE
date BETWEEN startDate AND endDate 
GROUP BY
district_id, district_name ;
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
block_id,
block_name as level,
district_id,
sum(sum_attendance) as present_students,
sum(count_attendance) as total_students,
ROUND(SUM(sum_attendance) * 100 / sum(count_attendance), 2) as perc_students
from
student_attendance.stud_avg_block
 WHERE
date BETWEEN startDate AND endDate and district_id = {district_id}
GROUP BY
block_id,block_name,district_id `,
            },
            "actions": {
                "queries": {
                    "barChart":`select 
block_id,
block_name as level,
district_id,
sum(sum_attendance) as present_students,
sum(count_attendance) as total_students,
ROUND(SUM(sum_attendance) * 100 / sum(count_attendance), 2) as perc_students
from
student_attendance.stud_avg_block
 WHERE
date BETWEEN startDate AND endDate and district_id = {district_id}
GROUP BY
block_id,block_name,district_id `,
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
cluster_id,
cluster_name as level,
block_id,
district_id,
sum(sum_attendance) as present_students,
sum(count_attendance) as total_students,
ROUND(SUM(sum_attendance) * 100 / sum(count_attendance), 2) as perc_students
from
student_attendance.stud_avg_cluster
 WHERE
date BETWEEN startDate AND endDate and block_id = {block_id}
GROUP BY
cluster_id,cluster_name,block_id,district_id `,
            },
            "actions": {
                "queries": {
                    "barChart":`select 
cluster_id,
cluster_name as level,
block_id,
district_id,
sum(sum_attendance) as present_students,
sum(count_attendance) as total_students,
ROUND(SUM(sum_attendance) * 100 / sum(count_attendance), 2) as perc_students
from
student_attendance.stud_avg_cluster
 WHERE
date BETWEEN startDate AND endDate and block_id = {block_id}
GROUP BY
cluster_id,cluster_name,block_id,district_id;`
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
school_id,
school_name as level,
cluster_id,
block_id,
district_id,
sum(sum_attendance) as present_students,
sum(count_attendance) as total_students,
ROUND(SUM(sum_attendance) * 100 / sum(count_attendance), 2) as perc_students
from
student_attendance.stud_avg_school
 WHERE
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
GROUP BY
school_id,school_name,cluster_id,block_id,district_id `,
            },
            "actions": {
                "queries": {
                    "barChart":`select 
school_id,
school_name as level,
cluster_id,
block_id,
district_id,
sum(sum_attendance) as present_students,
sum(count_attendance) as total_students,
ROUND(SUM(sum_attendance) * 100 / sum(count_attendance), 2) as perc_students
from
student_attendance.stud_avg_school
 WHERE
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
GROUP BY
school_id,school_name,cluster_id,block_id,district_id;`
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
                "title": "Average Percentage 2"
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
// Average student present--> chart left
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
                "barChart": `select 
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
                TO_CHAR(sam.date, 'YYYY-MM-DD');`,
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
// done
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
                "table": `SELECT 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   COALESCE((SUM(ts.count_attendance) - SUM(ts.sum_attendance)), 0) AS absent_students,
   SUM(ts.count_attendance) AS total_students,
   ROUND(((SUM(ts.count_attendance) - SUM(ts.sum_attendance)) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`
            },
            "actions": {
                "queries": {
                    "table": `SELECT 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   COALESCE((SUM(ts.count_attendance) - SUM(ts.sum_attendance)), 0) AS absent_students,
   SUM(ts.count_attendance) AS total_students,
   ROUND(((SUM(ts.count_attendance) - SUM(ts.sum_attendance)) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`,
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
                "table": `  SELECT 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   COALESCE((SUM(ts.count_attendance) - SUM(ts.sum_attendance)), 0) AS absent_students,
   SUM(ts.count_attendance) AS total_students,
   ROUND(((SUM(ts.count_attendance) - SUM(ts.sum_attendance)) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.district_id = {district_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`
            },
            "actions": {
                "queries": {
                    "table": `  SELECT 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   COALESCE((SUM(ts.count_attendance) - SUM(ts.sum_attendance)), 0) AS absent_students,
   SUM(ts.count_attendance) AS total_students,
   ROUND(((SUM(ts.count_attendance) - SUM(ts.sum_attendance)) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.district_id = {district_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`,
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
                "table": `SELECT 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.school_id,
   ts.school_name,
   COALESCE((SUM(ts.count_attendance) - SUM(ts.sum_attendance)), 0) AS absent_students,
   SUM(ts.count_attendance) AS total_students,
   ROUND(((SUM(ts.count_attendance) - SUM(ts.sum_attendance)) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.block_id = {block_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`
            },
            "actions": {
                "queries": {
                    "table": `SELECT 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.school_id,
   ts.school_name,
   COALESCE((SUM(ts.count_attendance) - SUM(ts.sum_attendance)), 0) AS absent_students,
   SUM(ts.count_attendance) AS total_students,
   ROUND(((SUM(ts.count_attendance) - SUM(ts.sum_attendance)) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.block_id = {block_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`,
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
                "table":`SELECT 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.cluster_id,
   ts.cluster_name,
   ts.school_id,
   ts.school_name,
   COALESCE((SUM(ts.count_attendance) - SUM(ts.sum_attendance)), 0) AS absent_students,
   SUM(ts.count_attendance) AS total_students,
   ROUND(((SUM(ts.count_attendance) - SUM(ts.sum_attendance)) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.cluster_id = {cluster_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.cluster_id,
   ts.cluster_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`
            },
            "actions": {
                "queries": {
                    "table": `SELECT 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.cluster_id,
   ts.cluster_name,
   ts.school_id,
   ts.school_name,
   COALESCE((SUM(ts.count_attendance) - SUM(ts.sum_attendance)), 0) AS absent_students,
   SUM(ts.count_attendance) AS total_students,
   ROUND(((SUM(ts.count_attendance) - SUM(ts.sum_attendance)) * 100.0) / SUM(ts.count_attendance), 2) AS perc_students
FROM
   student_attendance.stud_avg_school AS ts
JOIN 
   (
       SELECT 
           school_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           student_attendance.stud_avg_school
       WHERE 
           date BETWEEN startDate AND endDate
       GROUP BY 
           school_id
   ) AS dc ON ts.school_id = dc.school_id
WHERE 
   ts.date BETWEEN startDate AND endDate
   AND ts.cluster_id = {cluster_id}
GROUP BY 
   ts.district_id,
   ts.district_name,
   ts.block_id,
   ts.block_name,
   ts.cluster_id,
   ts.cluster_name,
   ts.school_id,
   ts.school_name,
   dc.total_days;`,
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
// done
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
                "barChart": `select                    
  TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
  coalesce((sum(sam.count_attendance) - sum(sum_attendance)),0) as absent_students
  from
  student_attendance.stud_avg_dis sam
  where 
  sam.date between startDate AND endDate  
GROUP BY
TO_CHAR(sam.date, 'YYYY-MM-DD')
order by
TO_CHAR(sam.date, 'YYYY-MM-DD');`,
            },
            "actions": {
                "queries": {
                    "barChart":`select                    
  TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
  coalesce((sum(sam.count_attendance) - sum(sum_attendance)),0) as absent_students
  from
  student_attendance.stud_avg_dis sam
  where 
  sam.date between startDate AND endDate  
GROUP BY
TO_CHAR(sam.date, 'YYYY-MM-DD')
order by
TO_CHAR(sam.date, 'YYYY-MM-DD');`
                
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
	sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
  coalesce((sum(sam.count_attendance) - sum(sum_attendance)),0) as absent_students
  from
  student_attendance.stud_avg_block sam
  where 
  sam.date between startDate AND endDate  and sam.district_id = {district_id}
GROUP BY
sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD')
order by
TO_CHAR(sam.date, 'YYYY-MM-DD');`,
            },
            "actions": {
                "queries": {
                    "barChart":`select    
	sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
  coalesce((sum(sam.count_attendance) - sum(sum_attendance)),0) as absent_students
  from
  student_attendance.stud_avg_block sam
  where 
  sam.date between startDate AND endDate  and sam.district_id = {district_id}
GROUP BY
sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD')
order by
TO_CHAR(sam.date, 'YYYY-MM-DD');`,
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
	sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
	sam.cluster_id,
	sam.cluster_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
  coalesce((sum(sam.count_attendance) - sum(sum_attendance)),0) as absent_students
  from
  student_attendance.stud_avg_cluster sam
  where 
  sam.date between startDate AND endDate  and sam.block_id = {block_id}
GROUP BY
sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
	sam.cluster_name,
	sam.cluster_id,
  TO_CHAR(sam.date, 'YYYY-MM-DD')
order by
TO_CHAR(sam.date, 'YYYY-MM-DD');`,
            },
            "actions": {
                "queries": {
                    "barChart":`select    
	sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
	sam.cluster_id,
	sam.cluster_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
  coalesce((sum(sam.count_attendance) - sum(sum_attendance)),0) as absent_students
  from
  student_attendance.stud_avg_cluster sam
  where 
  sam.date between startDate AND endDate  and sam.block_id = {block_id}
GROUP BY
sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
	sam.cluster_name,
	sam.cluster_id,
  TO_CHAR(sam.date, 'YYYY-MM-DD')
order by
TO_CHAR(sam.date, 'YYYY-MM-DD');`
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
	sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
	sam.cluster_id,
	sam.cluster_name,
	sam.school_id,
	sam.school_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
  coalesce((sum(sam.count_attendance) - sum(sum_attendance)),0) as absent_students
  from
  student_attendance.stud_avg_school sam
  where 
  sam.date between startDate AND endDate  and sam.cluster_id = {cluster_id}
GROUP BY
sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
	sam.cluster_name,
	sam.cluster_id,
	sam.school_id,
	sam.school_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD')
order by
TO_CHAR(sam.date, 'YYYY-MM-DD');    
            `,
            },
            "actions": {
                "queries": {
                    "barChart":`select    
	sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
	sam.cluster_id,
	sam.cluster_name,
	sam.school_id,
	sam.school_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD') AS level,
  coalesce((sum(sam.count_attendance) - sum(sum_attendance)),0) as absent_students
  from
  student_attendance.stud_avg_school sam
  where 
  sam.date between startDate AND endDate  and sam.cluster_id = {cluster_id}
GROUP BY
sam.district_id,
	sam.district_name,
	sam.block_id,
	sam.block_name,
	sam.cluster_name,
	sam.cluster_id,
	sam.school_id,
	sam.school_name,
  TO_CHAR(sam.date, 'YYYY-MM-DD')
order by
TO_CHAR(sam.date, 'YYYY-MM-DD');`
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
// done
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
                "barChart": `select 
district_id,
district_name as level,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS perc_students
from
student_attendance.stud_avg_dis 
 WHERE
date BETWEEN startDate AND endDate 
GROUP BY
district_id, district_name;`,
            },
            "actions": {
                "queries": {
                    "barChart":`select 
district_id,
district_name as level,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS perc_students
from
student_attendance.stud_avg_dis 
 WHERE
date BETWEEN startDate AND endDate 
GROUP BY
district_id, district_name;`
                
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
block_id,
block_name as level,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS perc_students
from
student_attendance.stud_avg_block
 WHERE
date BETWEEN startDate AND endDate and district_id = {district_id} 
GROUP BY
block_id, block_name;`,
            },
            "actions": {
                "queries": {
                    "barChart":`select 
block_id,
block_name as level,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS perc_students
from
student_attendance.stud_avg_block
 WHERE
date BETWEEN startDate AND endDate and district_id = {district_id} 
GROUP BY
block_id, block_name;`,
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
cluster_id,
cluster_name as level,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS perc_students
from
student_attendance.stud_avg_cluster
 WHERE
date BETWEEN startDate AND endDate and block_id = {block_id} 
GROUP BY
cluster_id, cluster_name;`,
            },
            "actions": {
                "queries": {
                    "barChart":`select 
cluster_id,
cluster_name as level,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS perc_students
from
student_attendance.stud_avg_cluster
 WHERE
date BETWEEN startDate AND endDate and block_id = {block_id} 
GROUP BY
cluster_id, cluster_name;`
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
school_id,
school_name as level,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS perc_students
from
student_attendance.stud_avg_school
 WHERE
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
GROUP BY
school_id, school_name;`,
            },
            "actions": {
                "queries": {
                    "barChart":`select 
school_id,
school_name as level,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS perc_students
from
student_attendance.stud_avg_school
 WHERE
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
GROUP BY
school_id, school_name;`
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
// done
student_average_absent_bignumber: {
    "label": "Average Student Present",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "bigNumber": `SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
                from (select 
district_id,
district_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_dis
 WHERE
date BETWEEN startDate AND endDate
GROUP BY
district_id, district_name) AS avg_query;`

            },
            "actions": {
                "queries": {
                    "bigNumber": `SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
                from (select 
district_id,
district_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_dis
 WHERE
date BETWEEN startDate AND endDate
GROUP BY
district_id, district_name) AS avg_query;`
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
                "bigNumber": `SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
from (select 
district_id,
district_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_dis
 WHERE
date BETWEEN startDate AND endDate  and district_id = {district_id}
GROUP BY
district_id, district_name) AS avg_query;`
            },
            "actions": {
                "queries": {
                    "bigNumber": `SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
from (select 
district_id,
district_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_dis
 WHERE
date BETWEEN startDate AND endDate  and district_id = {district_id}
GROUP BY
district_id, district_name) AS avg_query;`
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
                "bigNumber": `SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
from (select 
block_id,
block_name,
district_id,
district_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_block
 WHERE
date BETWEEN startDate AND endDate and block_id = {block_id}
GROUP BY
block_id, block_name,district_id,district_name) AS avg_query;`,
                
            },
            "actions": {
                "queries": {
                    "bigNumber": `SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
from (select 
block_id,
block_name,
district_id,
district_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_block
 WHERE
date BETWEEN startDate AND endDate and block_id = {block_id}
GROUP BY
block_id, block_name,district_id,district_name) AS avg_query;
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
                "bigNumber": `SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
from (select 
cluster_id,
cluster_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_cluster
 WHERE
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
GROUP BY
cluster_id, cluster_name) AS avg_query;`,
               
            },
            "actions": {
                "queries": {
                    "bigNumber": `SELECT  ROUND(AVG(absent_students_percentage)) AS percentage_students
from (select 
cluster_id,
cluster_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_cluster
 WHERE
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
GROUP BY
cluster_id, cluster_name) AS avg_query;`,
                    
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
// done
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
                "table": `select 
district_id,
district_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_dis
 WHERE
date BETWEEN startDate AND endDate
GROUP BY
district_id, district_name;`,
            },
            "actions": {
                "queries": {
                    "table": `select 
district_id,
district_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_dis
 WHERE
date BETWEEN startDate AND endDate
GROUP BY
district_id, district_name;`,
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
                "table": `select 
block_id,
block_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_block
 WHERE
date BETWEEN startDate AND endDate and district_id = {district_id}
GROUP BY
block_id, block_name;`,
            },
            "actions": {
                "queries": {
                    "table": `select 
block_id,
block_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_block
 WHERE
date BETWEEN startDate AND endDate and district_id = {district_id}
GROUP BY
block_id, block_name;`,
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
                "table": `select 
cluster_id,
cluster_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_cluster
 WHERE
date BETWEEN startDate AND endDate and block_id = { block_id }
GROUP BY
cluster_id, cluster_name;`,
            },
            "actions": {
                "queries": {
                    "table": `select 
cluster_id,
cluster_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_cluster
 WHERE
date BETWEEN startDate AND endDate and block_id = { block_id }
GROUP BY
cluster_id, cluster_name;`,
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
                "table": `select 
school_id,
school_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_school
 WHERE
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
GROUP BY
school_id, school_name;`
            },
            "actions": {
                "queries": {
                    "table": `select 
school_id,
school_name,
COALESCE((SUM(count_attendance) - SUM(sum_attendance)), 0) AS absent_students,
   SUM(count_attendance) AS total_students,
   ROUND(((SUM(count_attendance) - SUM(sum_attendance)) * 100.0) / SUM(count_attendance), 2) AS absent_students_percentage
from
student_attendance.stud_avg_school
 WHERE
date BETWEEN startDate AND endDate and cluster_id = {cluster_id}
GROUP BY
school_id, school_name;`,
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
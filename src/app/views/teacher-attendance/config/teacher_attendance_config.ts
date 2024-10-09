export const config = {
    criteria_config: {
        indicatorName: 'Teacher Attendance',
        minRange: 0,
        maxRange: 100,
        defaultFromRange: 0,
        defaultToRange: 100,
        unitKey: "perc_teachers",
        linkedReports: ['tas_average_attendance', 'tas_average_attendance_barchart', 'average_attendance_school']
    },
    // Map View of Teacher Attendance
    filters: [
        {

            label: 'Map View of Teacher Attendance',

            name: 'Metric',

            id: 'metric',

            values: ['percentage_of_teacher_present', 'percentage_of_teacher_absent'],
        },
        {

            label: 'Map View of Non Teaching Staff Attendance',

            name: 'Metric',

            id: 'metric',

            values: ['percentage_of_non_teacher_present', 'percentage_of_non_teacher_absent'],
        },
    ],

    tas_average_attendance_map:{
        "label": "Average Teachers Present",
        "filters":
            [
                {
                    "name": "State",
                    "hierarchyLevel": "1",
                    "timeSeriesQueries": {
                        "map": `SELECT
                        tt.district_id,
                        d.district_name,
                        d.latitude,
                        d.longitude,
                        COALESCE(SUM(tp.sum), 0) AS total_teachers_present,
                        COALESCE(SUM(ta.sum), 0) AS total_teachers_absent,
                        COALESCE(SUM(tt.sum), 0) AS total_teachers,
                        CEIL(ROUND(CAST((SUM(tp.sum) /
                                         SUM(tt.sum)) * 100 AS NUMERIC), 0)) AS perc_teachers
                    FROM
                        datasets.staffattendance_total_teachers_Daily_district AS tt
                    JOIN
                        datasets.staffattendance_total_teachers_present_Daily_district AS tp ON tt.district_id = tp.district_id AND tt.date = tp.date
                    JOIN
                        datasets.staffattendance_total_teachers_absent_Daily_district AS ta ON tt.district_id = ta.district_id AND tt.date = ta.date
                    JOIN
                        dimensions.district AS d ON tt.district_id = d.district_id
                    WHERE
                        tt.date BETWEEN startDate AND endDate
                    GROUP BY
                        tt.district_id,
                        d.district_name,
                        d.latitude,
                        d.longitude;`
                    },
                    "actions": {
                        "queries": {
                            "map": `SELECT
                            tt.district_id,
                            d.district_name,
                            d.latitude,
                            d.longitude,
                            COALESCE(SUM(tp.sum), 0) AS total_teachers_present,
                            COALESCE(SUM(ta.sum), 0) AS total_teachers_absent,
                            COALESCE(SUM(tt.sum), 0) AS total_teachers,
                            CEIL(ROUND(CAST((SUM(tp.sum) /
                                             SUM(tt.sum)) * 100 AS NUMERIC), 0)) AS perc_teachers
                        FROM
                            datasets.staffattendance_total_teachers_Daily_district AS tt
                        JOIN
                            datasets.staffattendance_total_teachers_present_Daily_district AS tp ON tt.district_id = tp.district_id AND tt.date = tp.date
                        JOIN
                            datasets.staffattendance_total_teachers_absent_Daily_district AS ta ON tt.district_id = ta.district_id AND tt.date = ta.date
                        JOIN
                            dimensions.district AS d ON tt.district_id = d.district_id
                        WHERE
                            tt.date BETWEEN startDate AND endDate
                        GROUP BY
                            tt.district_id,
                            d.district_name,
                            d.latitude,
                            d.longitude;`,
                        },
                        "level": "district"
                    }
                },
                {
                    "name": "District",
                    "hierarchyLevel": "2",
                    "timeSeriesQueries": {
                        "map": `select
                        b.district_id,
                        b.district_name,
                        tt.block_id,
                        b.block_name,
                        b.latitude,
                        b.longitude,
                        COALESCE(sum(tp.sum),0) as total_teachers_present,
                        COALESCE(sum(ta.sum),0) as total_teachers_absent,
                        COALESCE(sum(tt.sum),0) as total_teachers,
                        CEIL(ROUND(CAST((SUM(tp.sum) / SUM(tt.sum)) * 100 AS NUMERIC),0)) AS perc_teachers
                        from
                        datasets.staffattendance_total_teachers_Daily_block as tt
                        JOIN
                        datasets.staffattendance_total_teachers_present_Daily_block as tp on tt.block_id = tp.block_id and tt.date = tp.date
                        JOIN
                        datasets.staffattendance_total_teachers_absent_Daily_block as ta on tt.block_id = ta.block_id and tt.date = ta.date
                        LEFT JOIN
                        dimensions.block as b on tt.block_id = b.block_id
                        LEFT Join
                        dimensions.district as d on b.district_id = d.district_id
                        Where tt.date BETWEEN startDate AND endDate  and b.district_id = {district_id}
                        Group by
                        b.district_id,
                        b.district_name,
                        tt.block_id,
                        b.block_name,
                        b.latitude,
                        b.longitude
                        `,
                    },
                    "actions": {
                        "queries": {
                            "map": `select
                            b.district_id,
                            b.district_name,
                            tt.block_id,
                            b.block_name,
                            b.latitude,
                            b.longitude,
                            COALESCE(sum(tp.sum),0) as total_teachers_present,
                            COALESCE(sum(ta.sum),0) as total_teachers_absent,
                            COALESCE(sum(tt.sum),0) as total_teachers,
                            CEIL(ROUND(CAST((SUM(tp.sum) / SUM(tt.sum)) * 100 AS NUMERIC),0)) AS perc_teachers
                            from
                            datasets.staffattendance_total_teachers_Daily_block as tt
                            JOIN
                            datasets.staffattendance_total_teachers_present_Daily_block as tp on tt.block_id = tp.block_id and tt.date = tp.date
                            JOIN
                            datasets.staffattendance_total_teachers_absent_Daily_block as ta on tt.block_id = ta.block_id and tt.date = ta.date
                            LEFT JOIN
                            dimensions.block as b on tt.block_id = b.block_id
                            LEFT Join
                            dimensions.district as d on b.district_id = d.district_id
                            Where tt.date BETWEEN startDate AND endDate  and b.district_id = {district_id}
                            Group by
                            b.district_id,
                            b.district_name,
                            tt.block_id,
                            b.block_name,
                            b.latitude,
                            b.longitude
                            `,
                        },
                        "level": "block"
                    }
                },
                {
                    "name": "Block",
                    "hierarchyLevel": "3",
                    "timeSeriesQueries": {
                        "map": "SELECT Ceil(Round(Cast(( Sum(intermediate_table.teachers_present_intermediate) / Sum( intermediate_table.total_teachers_intemediate)) * 100 AS NUMERIC), 2)) AS perc_teachers, Ceil(Avg(total_teachers_cluster_wise)) AS total_teachers, Ceil(Avg(present_table_cluster_wise)) AS teachers_present, Ceil(Avg(s.totalschools)) AS total_schools, intermediate_table.cluster_id, intermediate_table.cluster_name, s.latitude, s.longitude FROM (SELECT Sum(present_table.sum) AS teachers_present_intermediate, Sum(total_teachers.sum) AS total_teachers_intemediate, present_table.cluster_id, c.cluster_name, Avg(total_teachers.sum) AS total_teachers_cluster_wise, Avg(present_table.sum) AS present_table_cluster_wise FROM datasets.sch_att_teachers_marked_present_daily_cluster AS present_table JOIN datasets.sch_att_total_teachers_daily_cluster AS total_teachers ON present_table.date = total_teachers.date AND present_table.cluster_id = total_teachers.cluster_id JOIN dimensions.cluster c ON present_table.cluster_id = c.cluster_id WHERE present_table.date BETWEEN startDate and endDate AND c.block_id = {block_id} GROUP BY present_table.cluster_id, c.cluster_name) AS intermediate_table JOIN (SELECT cluster_id, Count(school_id) AS totalSchools, avg(cast (latitude as numeric)) as latitude, avg(cast (longitude as numeric)) as longitude FROM dimensions.school GROUP BY cluster_id) AS s ON intermediate_table.cluster_id = s.cluster_id GROUP BY intermediate_table.cluster_id, intermediate_table.cluster_name, s.latitude, s.longitude ORDER BY perc_teachers ASC",
                    },
                    "actions": {
                        "queries": {
                            "map": "",
                        },
                        "level": "cluster"
                    }
                },
                {
                    "name": "Cluster",
                    "hierarchyLevel": "4",
                    "timeSeriesQueries": {
                        "map": "select latitude, longitude, a.school_id, school_name, sum(a.total_teachers) as total_teachers ,sum(a.teachers_present) as teachers_present, ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from  (select present_table.school_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_school as present_table join datasets.sch_att_total_teachers_daily_school as total_teachers on present_table.date = total_teachers.date and present_table.school_id = total_teachers.school_id) as a join dimensions.school as school_wise_table on school_wise_table.school_id = a.school_id where cluster_id = {cluster_id} and a.att_date between startDate and endDate group by a.school_id, school_name, latitude, longitude order by perc_teachers asc",
                    },
                    "actions": {
                        "queries": {
                            "map": "",
                        },
                        "level": "school"
                    }
                }
            ],
        "options":
        {
            "map":
             {
                // "indicatorType": "percent",
                "indicator": "perc_teachers",
                "legend": { "title": " Teachers Availability" },
                // "metricFilterNeeded": "true",
                // "indicator": 'metric',
                // "totalOfPercentage":"total_teachers",
                // "indicatorType": "percent",

				// "legend": {

				// 	"title": 'Teacher Availability',
                // },

                "tooltipMetrics": [
                    {
                        "valuePrefix": "District Id: ",
                        "value": "district_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "District Name: ",
                        "value": "district_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Block Id: ",
                        "value": "block_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Block Name: ",
                        "value": "block_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Cluster Id: ",
                        "value": "cluster_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Cluster Name: ",
                        "value": "cluster_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "School Id: ",
                        "value": "school_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "School Name: ",
                        "value": "school_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Total Teachers Present: ",
                        "value": "total_teachers_present",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Total Teachers Absent: ",
                        "value": "total_teachers_absent",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Total Teachers: ",
                        "value": "total_teachers",
                        "valueSuffix": "\n"
                    },
                    // {
                    //     "valuePrefix": "Total Teachers: ",
                    //     "value": "total_teachers",
                    //     "valueSuffix": "\n"
                    // },
                    // {
                    //     "valuePrefix": "Total Teachers Present: ",
                    //     "value": "teachers_present",
                    //     "valueSuffix": "\n"
                    // },
                    {
                        "valuePrefix": "Average Teachers Present: ",
                        "value": "perc_teachers",
                        "valueSuffix": "%\n"
                    }
                ]
            }
        }
    },
    

    // tac_average_attendance_compliance: {
    //     "label": "Average Teachers Reporting Attendance",
    //     "defaultLevel": "state",
    //     "filters": [
    //         {
    //             "name": "State",
    //             "labelProp": "state_name",
    //             "valueProp": "state_id",
    //             "hierarchyLevel": "1",
    //             "timeSeriesQueries": {
    //                 "table": "SELECT Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / Cast( Count(t2.school_id) AS NUMERIC)) * 100) AS compliance_percentage, t2.district_id, t2.district_name FROM (SELECT c.percentage, c.school_id AS school_id FROM (SELECT a.school_id, ( Sum(a.sum) / Sum(b.sum) ) * 100 AS percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date WHERE a.date BETWEEN startDate AND endDate GROUP BY a.school_id) AS c WHERE c.percentage > 50) AS t1 FULL JOIN (SELECT d.school_id, e.district_id, e.district_name FROM datasets.sch_att_teachers_marked_daily_school AS d JOIN dimensions.school AS e ON d.school_id = e.school_id GROUP BY d.school_id, e.district_id, e.district_name) AS t2 ON t1.school_id = t2.school_id GROUP BY t2.district_id, t2.district_name order by Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / Cast ( Count(t2.school_id) AS NUMERIC) ) * 100) desc",
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "table": "select min(date) as min_date, max(date) as max_date, district_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_atd_cmp_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id left join ingestion.dimension_district as d on t.district_id = d.district_id where m.state_id = {state_id} group by t.district_id ,district_name",
    //                 },
    //                 "level": "district"
    //             }
    //         },
    //         {
    //             "name": "District",
    //             "labelProp": "district_name",
    //             "valueProp": "district_id",
    //             "hierarchyLevel": "2",
    //             "timeSeriesQueries": {
    //                 "table": "SELECT Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / NULLIF(Cast(Count(t2.school_id) AS NUMERIC), 0)) * 100) AS compliance_percentage, t2.block_id, t2.block_name FROM(SELECT c.percentage, c.school_id AS school_id FROM (SELECT a.school_id, ( Sum(a.sum) / Sum(b.sum) ) * 100 AS percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date WHERE a.date BETWEEN startDate AND endDate GROUP BY a.school_id) AS c WHERE c.percentage > 50) AS t1 FULL JOIN (SELECT d.school_id, e.block_id, e.block_name FROM datasets.sch_att_teachers_marked_daily_school AS d JOIN dimensions.school AS e ON d.school_id = e.school_id WHERE e.district_id = {district_id} GROUP BY d.school_id, e.block_id, e.block_name) AS t2 ON t1.school_id = t2.school_id where t2.block_id is not null GROUP BY t2.block_id, t2.block_name order by Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / NULLIF(Cast(Count(t2.school_id) AS NUMERIC), 0) ) * 100) desc;"
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "table": "select min(date) as min_date, max(date) as max_date, block_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_atd_cmp_by_block as t left join ingestion.dimension_master as m on t.block_id = m.block_id left join ingestion.dimension_block as b on t.block_id = b.block_id left join ingestion.dimension_district as d on m.district_id = d.district_id where m.district_id={district_id} group by t.block_id,block_name,district_name",
    //                 },
    //                 "level": "block"
    //             }
    //         },
    //         {
    //             "name": "Block",
    //             "labelProp": "block_name",
    //             "valueProp": "block_id",
    //             "hierarchyLevel": "3",
    //             "timeSeriesQueries": {
    //                 "table": "SELECT Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / NULLIF(Cast( Count(t2.school_id) AS NUMERIC),0)) * 100) AS compliance_percentage, t2.cluster_id, t2.cluster_name FROM (SELECT c.percentage, c.school_id AS school_id FROM (SELECT a.school_id, ( Sum(a.sum) / Sum(b.sum) ) * 100 AS percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date WHERE a.date BETWEEN startDate and endDate GROUP BY a.school_id) AS c WHERE c.percentage > 50) AS t1 FULL JOIN (SELECT d.school_id, e.cluster_id, e.cluster_name FROM datasets.sch_att_teachers_marked_daily_school AS d JOIN dimensions.school AS e ON d.school_id = e.school_id WHERE e.block_id = {block_id} GROUP BY d.school_id, e.cluster_id, e.cluster_name) AS t2 ON t1.school_id = t2.school_id where cluster_id is not null GROUP BY t2.cluster_id, t2.cluster_name order by Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / NULLIF(Cast ( Count(t2.school_id) AS NUMERIC),0) ) * 100) desc"
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "table": "select min(date) as min_date, max(date) as max_date, cluster_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_atd_cmp_by_cluster as t left join ingestion.dimension_master as m on t.cluster_id = m.cluster_id left join ingestion.dimension_cluster as c on t.cluster_id = c.cluster_id left join ingestion.dimension_block as b on m.block_id = b.block_id left join ingestion.dimension_district as d on m.district_id = d.district_id where m.block_id={block_id} group by t.cluster_id,cluster_name,block_name,district_name",
    //                 },
    //                 "level": "cluster"
    //             }
    //         },
    //         {
    //             "name": "Cluster",
    //             "labelProp": "cluster_name",
    //             "valueProp": "cluster_id",
    //             "hierarchyLevel": "4",
    //             "timeSeriesQueries": {
    //                 "table": "SELECT e.school_name, Ceil(Round(Sum(a.sum) / Sum(b.sum) * 100)) AS compliance_percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date JOIN dimensions.school AS e ON a.school_id = e.school_id WHERE a.date BETWEEN startDate AND endDate AND e.cluster_id = {cluster_id} GROUP BY a.school_id, e.school_name order by Ceil(Round(Sum(a.sum) / Sum(b.sum) * 100)) desc"
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "table": "select min(date) as min_date, max(date) as max_date, school_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_atd_cmp_by_school as t left join ingestion.dimension_master as m on t.school_id = m.school_id left join ingestion.dimension_district as d on d.district_id = m.district_id left join ingestion.dimension_block as b on b.block_id = m.block_id left join ingestion.dimension_cluster as c on c.cluster_id = m.cluster_id left join ingestion.dimension_school as s on s.school_id = t.school_id where m.cluster_id={cluster_id} group by school_name,cluster_name,block_name,district_name",
    //                 },
    //                 "level": "school"
    //             }
    //         },
    //         // {
    //         //     "name": "School",
    //         //     "labelProp": "school_name",
    //         //     "valueProp": "school_id",
    //         //     "hierarchyLevel": "5",
    //         //     "timeSeriesQueries": {
    //         //         // "table":"select  e.school_name ,ceil(round(sum(a.sum)/sum(b.sum)*100))as compliance_percentage, sum(b.sum) as total_teachers, sum(a.sum) as attendace_marked from datasets.sch_att_total_teachers_daily_school as b join datasets.sch_att_teachers_marked_daily_school as a on a.school_id = b.school_id and a.date = b.date join dimensions.school as e on a.school_id = e.school_id where a.date between startDate and endDate group by a.school_id,e.school_name"
    //         //         "table": "" //in grade there is no school_id
    //         //     },
    //         //     "actions": {
    //         //         "queries": {
    //         //             "table": "select min(date) as min_date, max(date) as max_date, grade, school_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_atd_cmp_by_school as t left join ingestion.dimension_master as m on t.school_id = m.school_id left join ingestion.dimension_district as d on d.district_id = m.district_id left join ingestion.dimension_block as b on b.block_id = m.block_id left join ingestion.dimension_cluster as c on c.cluster_id = m.cluster_id left join ingestion.dimension_school as s on s.school_id = t.school_id where m.school_id={school_id} group by grade,school_name,cluster_name,block_name,district_name",
    //         //         },
    //         //         "level": "school"
    //         //     }
    //         // }
    //     ],
    //     "options": {
    //         "table": {
    //             "columns": [
    //                 {
    //                     name: "State",
    //                     property: "state_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "District",
    //                     property: "district_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "Block",
    //                     property: "block_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "Cluster",
    //                     property: "cluster_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "School",
    //                     property: "school_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "Grade",
    //                     property: "grade",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "% Teachers Reporting Attendance",
    //                     property: "compliance_percentage",
    //                     class: "text-center",
    //                     valueSuffix: "%",
    //                     isHeatMapRequired: true,
    //                     color: {
    //                         type: "percentage",
    //                         values: [
    //                             {
    //                                 color: "#007000",
    //                                 breakPoint: 70
    //                             },
    //                             {
    //                                 color: "#FFBF00",
    //                                 breakPoint: 40
    //                             },
    //                             {
    //                                 color: "#D2222D",
    //                                 breakPoint: 0
    //                             }
    //                         ]
    //                     },
    //                 }
    //             ],
    //             "sortByProperty": "state_name",
    //             "sortDirection": "desc"
    //         },
    //         "bigNumber": {
    //             "valueSuffix": '%'
    //         }
    //     }
    // },
    // tac_average_attendance_compliance_bignumber: {
    //     "label": "Average Teachers Reporting Attendance",
    //     "filters": [
    //         {
    //             "name": "State",
    //             "labelProp": "state_name",
    //             "valueProp": "state_id",
    //             "hierarchyLevel": "1",
    //             "timeSeriesQueries": {
    //                 "bigNumber": "select ceil((cast( count(t1.school_id) as numeric)/cast (count(t2.school_id) as numeric))*100) as compliance_percentage from (select c.percentage, c.school_id as school_id from  (select a.school_id,(sum(a.sum)/sum(b.sum))*100 as percentage, sum(b.sum) as total_teachers, sum(a.sum) as attendace_marked from datasets.sch_att_total_teachers_daily_school as b join datasets.sch_att_teachers_marked_daily_school as a on a.school_id = b.school_id and a.date = b.date where a.date between startDate and endDate group by a.school_id) as c where c.percentage > 50) as t1 full join (select d.school_id, e.district_id, e.district_name from datasets.sch_att_teachers_marked_daily_school as d join dimensions.school as e on d.school_id = e.school_id group by d.school_id, e.district_id, e.district_name) as t2 on t1.school_id = t2.school_id "
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "bigNumber": "select ceil((cast( count(t1.school_id) as numeric)/cast (count(t2.school_id) as numeric))*100) as compliance_percentage from (select c.percentage, c.school_id as school_id from  (select a.school_id,(sum(a.sum)/sum(b.sum))*100 as percentage, sum(b.sum) as total_teachers, sum(a.sum) as attendace_marked from datasets.sch_att_total_teachers_daily_school as b join datasets.sch_att_teachers_marked_daily_school as a on a.school_id = b.school_id and a.date = b.date group by a.school_id) as c where c.percentage > 50) as t1 full join (select d.school_id, e.district_id, e.district_name from datasets.sch_att_teachers_marked_daily_school as d join dimensions.school as e on d.school_id = e.school_id group by d.school_id, e.district_id, e.district_name) as t2 on t1.school_id = t2.school_id"
    //                 },
    //                 "level": "district"
    //             }
    //         },
    //         {
    //             "name": "District",
    //             "labelProp": "district_name",
    //             "valueProp": "district_id",
    //             "hierarchyLevel": "2",
    //             "timeSeriesQueries": {
    //                 "bigNumber": "SELECT Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / Cast( Count(t2.school_id) AS NUMERIC)) * 100) AS compliance_percentage FROM (SELECT c.percentage, c.school_id AS school_id FROM (SELECT a.school_id, ( Sum(a.sum) / Sum(b.sum) ) * 100 AS percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date WHERE a.date BETWEEN startDate AND endDate GROUP BY a.school_id) AS c WHERE c.percentage > 50) AS t1 FULL JOIN (SELECT d.school_id, e.district_id, e.district_name FROM datasets.sch_att_teachers_marked_daily_school AS d JOIN dimensions.school AS e ON d.school_id = e.school_id GROUP BY d.school_id, e.district_id, e.district_name) AS t2 ON t1.school_id = t2.school_id where district_id = {district_id} GROUP BY t2.district_id, t2.district_name "
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "bigNumber": "SELECT Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / Cast( Count(t2.school_id) AS NUMERIC)) * 100) AS compliance_percentage FROM (SELECT c.percentage, c.school_id AS school_id FROM (SELECT a.school_id, ( Sum(a.sum) / Sum(b.sum) ) * 100 AS percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date  GROUP BY a.school_id) AS c WHERE c.percentage > 50) AS t1 FULL JOIN (SELECT d.school_id, e.district_id, e.district_name FROM datasets.sch_att_teachers_marked_daily_school AS d JOIN dimensions.school AS e ON d.school_id = e.school_id GROUP BY d.school_id, e.district_id, e.district_name) AS t2 ON t1.school_id = t2.school_id where district_id = {district_id} GROUP BY t2.district_id, t2.district_name "
    //                 },
    //                 "level": "block"
    //             }
    //         },
    //         {
    //             "name": "Block",
    //             "labelProp": "block_name",
    //             "valueProp": "block_id",
    //             "hierarchyLevel": "3",
    //             "timeSeriesQueries": {
    //                 "bigNumber": "SELECT Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / Cast( Count(t2.school_id) AS NUMERIC)) * 100) AS compliance_percentage FROM (SELECT c.percentage, c.school_id AS school_id FROM (SELECT a.school_id, ( Sum(a.sum) / Sum(b.sum) ) * 100 AS percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date WHERE a.date BETWEEN startDate AND endDate GROUP BY a.school_id) AS c WHERE c.percentage > 50) AS t1 FULL JOIN (SELECT d.school_id, e.district_id, e.district_name, e.block_id, e.block_name FROM datasets.sch_att_teachers_marked_daily_school AS d JOIN dimensions.school AS e ON d.school_id = e.school_id GROUP BY d.school_id, e.district_id, e.district_name, e.block_id, e.block_name) AS t2 ON t1.school_id = t2.school_id where district_id = {district_id} and block_id = {block_id} GROUP BY t2.block_id, t2.block_name "
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "bigNumber": "SELECT Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / Cast( Count(t2.school_id) AS NUMERIC)) * 100) AS compliance_percentage FROM (SELECT c.percentage, c.school_id AS school_id FROM (SELECT a.school_id, ( Sum(a.sum) / Sum(b.sum) ) * 100 AS percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date  GROUP BY a.school_id) AS c WHERE c.percentage > 50) AS t1 FULL JOIN (SELECT d.school_id, e.district_id, e.district_name FROM datasets.sch_att_teachers_marked_daily_school AS d JOIN dimensions.school AS e ON d.school_id = e.school_id GROUP BY d.school_id, e.district_id, e.district_name) AS t2 ON t1.school_id = t2.school_id where district_id = {district_id} GROUP BY t2.district_id, t2.district_name "
    //                 },
    //                 "level": "cluster"
    //             }
    //         },
    //         {
    //             "name": "Cluster",
    //             "labelProp": "cluster_name",
    //             "valueProp": "cluster_id",
    //             "hierarchyLevel": "4",
    //             "timeSeriesQueries": {
    //                 "bigNumber": "select ceil(round(sum(a.sum)/sum(b.sum)*100))as compliance_percentage, sum(b.sum) as total_teachers, sum(a.sum) as attendace_marked from datasets.sch_att_total_teachers_daily_school as b join datasets.sch_att_teachers_marked_daily_school as a on a.school_id = b.school_id and a.date = b.date join dimensions.school as e on a.school_id = e.school_id where a.date between startDate and endDate and e.cluster_id={cluster_id}"
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "bigNumber": "select ceil(round(sum(a.sum)/sum(b.sum)*100))as compliance_percentage, sum(b.sum) as total_teachers, sum(a.sum) as attendace_marked from datasets.sch_att_total_teachers_daily_school as b join datasets.sch_att_teachers_marked_daily_school as a on a.school_id = b.school_id and a.date = b.date join dimensions.school as e on a.school_id = e.school_id where e.cluster_id={cluster_id}"
    //                 },
    //                 "level": "school"
    //             }
    //         },
    //         {
    //             "name": "School",
    //             "labelProp": "school_name",
    //             "valueProp": "school_id",
    //             "hierarchyLevel": "5",
    //             "timeSeriesQueries": {
    //                 "bigNumber": "select ceil(round(sum(a.sum)/sum(b.sum)*100))as compliance_percentage, sum(b.sum) as total_teachers, sum(a.sum) as attendace_marked from datasets.sch_att_total_teachers_daily_school as b join datasets.sch_att_teachers_marked_daily_school as a on a.school_id = b.school_id and a.date = b.date join dimensions.school as e on a.school_id = e.school_id where a.date between startDate and endDate and a.school_id={school_id}"
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "bigNumber": "select ceil(round(sum(a.sum)/sum(b.sum)*100))as compliance_percentage, sum(b.sum) as total_teachers, sum(a.sum) as attendace_marked from datasets.sch_att_total_teachers_daily_school as b join datasets.sch_att_teachers_marked_daily_school as a on a.school_id = b.school_id and a.date = b.date join dimensions.school as e on a.school_id = e.school_id where a.school_id={school_id}"
    //                 },
    //                 "level": "school"
    //             }
    //         },
    //         // {
    //         //     "name": "Grade",
    //         //     "labelProp": "grade",
    //         //     "valueProp": "grade",
    //         //     "hierarchyLevel": "6",
    //         //     "timeSeriesQueries": {
    //         //         "bigNumber": "select ceil(round(CAST(avg(a.teachers_present/a.teachers_marked)*100 as numeric),2)) as perc_teachers from  (select present_table.grade_state, present_table.school_id,present_table.date as att_date,present_table.sum as teachers_present,marked_table.sum as teachers_marked from datasets.sch_att_teacherspresent_daily_gender0school0grade as present_table join datasets.sch_att_teachersmarked_daily_gender0school0grade as marked_table on present_table.date = marked_table.date and present_table.school_id = marked_table.school_id and present_table.grade_state = marked_table.grade_state ) as a where school_id = {school_id} and grade_id = {grade_id} and a.att_date between startDate and endDate",
    //         //     },
    //         //     "actions": {
    //         //         "queries": {
    //         //             "bigNumber": "select ceil(round(CAST(avg(a.teachers_present/a.teachers_marked)*100 as numeric),2)) as perc_teachers from  (select present_table.grade_state, present_table.school_id,present_table.date as att_date,present_table.sum as teachers_present,marked_table.sum as teachers_marked from datasets.sch_att_teacherspresent_daily_gender0school0grade as present_table join datasets.sch_att_teachersmarked_daily_gender0school0grade as marked_table on present_table.date = marked_table.date and present_table.school_id = marked_table.school_id and present_table.grade_state = marked_table.grade_state ) as a where school_id = {school_id} and grade_id = {grade_id}",
    //         //         },
    //         //         "level": "school"
    //         //     }
    //         // }
    //     ],
    //     "options": {
    //         "bigNumber": {
    //             "title": "Average Teachers Reporting Attendance",
    //             "valueSuffix": '%',
    //             "property": 'compliance_percentage'
    //         }
    //     }
    // },
    // tac_attendance_compliance_rank: {
    //     "label": "Average Teachers Reporting Attendance",
    //     "defaultLevel": "district",
    //     "filters": [
    //         {
    //             "name": "District",
    //             "labelProp": "district_name",
    //             "valueProp": "district_id",
    //             "hierarchyLevel": "2",
    //             "timeSeriesQueries": {
    //                 "table": "select ceil((cast( count(t1.school_id) as numeric)/cast (count(t2.school_id) as numeric))*100) as compliance_percentage, dense_rank() over(order by ceil((cast( count(t1.school_id) as numeric)/cast (count(t2.school_id) as numeric))*100) desc) as rank, t2.district_id, t2.district_name from (select c.percentage, c.school_id as school_id from (select a.school_id,(sum(a.sum)/sum(b.sum))*100 as percentage, sum(b.sum) as total_teachers, sum(a.sum) as attendace_marked from datasets.sch_att_total_teachers_daily_school as b join datasets.sch_att_teachers_marked_daily_school as a on a.school_id = b.school_id and a.date = b.date where a.date between startDate and endDate group by a.school_id) as c where c.percentage > 50) as t1 full join (select d.school_id, e.district_id, e.district_name from datasets.sch_att_teachers_marked_daily_school as d join dimensions.school as e on d.school_id = e.school_id group by d.school_id, e.district_id, e.district_name) as t2 on t1.school_id = t2.school_id group by t2.district_id, t2.district_name "
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "table": "select district_name, dense_rank() over(order by avg(percentage) desc) as rank ,round(percentage ,0) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_district as d on t.district_id = d.district_id left join (select distinct(district_id), state_id from ingestion.dimension_master) as m on m.district_id = t.district_id where state_id = {state_id} group by t.district_id, district_name,t.percentage",
    //                 },
    //                 "level": "block"
    //             }
    //         },
    //         {
    //             "name": "Block",
    //             "labelProp": "block_name",
    //             "valueProp": "block_id",
    //             "hierarchyLevel": "3",
    //             "timeSeriesQueries": {
    //                 "table": "SELECT Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / Cast( Count(t2.school_id) AS NUMERIC)) * 100) AS compliance_percentage, Dense_rank() OVER( ORDER BY Ceil((Cast( Count(t1.school_id) AS NUMERIC)/Cast (Count(t2.school_id) AS NUMERIC))*100) DESC) AS rank, t2.block_id, t2.block_name FROM (SELECT c.percentage, c.school_id AS school_id FROM (SELECT a.school_id, ( Sum(a.sum) / Sum(b.sum) ) * 100 AS percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date WHERE a.date BETWEEN startDate AND endDate GROUP BY a.school_id) AS c WHERE c.percentage > 50) AS t1 FULL JOIN (SELECT d.school_id, e.district_id, e.district_name, e.block_id, e.block_name FROM datasets.sch_att_teachers_marked_daily_school AS d JOIN dimensions.school AS e ON d.school_id = e.school_id GROUP BY d.school_id, e.district_id, e.district_name, e.block_id, e.block_name) AS t2 ON t1.school_id = t2.school_id where district_id = {district_id} GROUP BY t2.block_id, t2.block_name "
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "table": "select block_name, dense_rank() over(order by avg(percentage) desc) as rank ,round(percentage ,0) as percentage from ingestion.sac_stds_avg_atd_by_block as t left join ingestion.dimension_block as b on t.block_id = b.block_id left join (select distinct(block_id), district_id from ingestion.dimension_master) as m on m.block_id = t.block_id where district_id = {district_id} group by t.block_id, block_name,t.percentage",
    //                 },
    //                 "level": "cluster"
    //             }
    //         },
    //         {
    //             "name": "Cluster",
    //             "labelProp": "cluster_name",
    //             "valueProp": "cluster_id",
    //             "hierarchyLevel": "4",
    //             "timeSeriesQueries": {
    //                 "table": "SELECT Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / Cast( Count(t2.school_id) AS NUMERIC)) * 100) AS compliance_percentage, Dense_rank() OVER( ORDER BY (Ceil(( Cast(Count(t1.school_id) AS NUMERIC) / Cast ( Count(t2.school_id) AS NUMERIC) ) * 100)) DESC) AS rank, t2.cluster_id, t2.cluster_name FROM (SELECT c.percentage, c.school_id AS school_id FROM (SELECT a.school_id, ( Sum(a.sum) / Sum(b.sum) ) * 100 AS percentage, Sum(b.sum) AS total_teachers, Sum(a.sum) AS attendace_marked FROM datasets.sch_att_total_teachers_daily_school AS b JOIN datasets.sch_att_teachers_marked_daily_school AS a ON a.school_id = b.school_id AND a.date = b.date WHERE a.date BETWEEN '2023-04-12' AND '2023-04-30' GROUP BY a.school_id) AS c WHERE c.percentage > 50) AS t1 FULL JOIN (SELECT d.school_id, e.cluster_id, e.cluster_name FROM datasets.sch_att_teachers_marked_daily_school AS d JOIN dimensions.school AS e ON d.school_id = e.school_id GROUP BY d.school_id, e.cluster_id, e.cluster_name) AS t2 ON t1.school_id = t2.school_id GROUP BY t2.cluster_id, t2.cluster_name"
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "table": "select cluster_name, dense_rank() over(order by avg(percentage) desc) as rank,round(percentage ,0) as percentage  from ingestion.sac_stds_avg_atd_by_cluster as t left join ingestion.dimension_cluster as c on t.cluster_id = c.cluster_id left join (select distinct(cluster_id), block_id from ingestion.dimension_master) as m on m.cluster_id = t.cluster_id where block_id = {block_id} group by t.cluster_id, cluster_name,t.percentage",
    //                 },
    //                 "level": "school"
    //             }
    //         },
    //         {
    //             "name": "School",
    //             "labelProp": "school_name",
    //             "valueProp": "school_id",
    //             "hierarchyLevel": "5",
    //             "timeSeriesQueries": {
    //                 "table": "select  e.school_name ,ceil(round(sum(a.sum)/sum(b.sum)*100)) as compliance_percentage,dense_rank() over(order by ceil(round(sum(a.sum)/sum(b.sum)*100)) desc) as rank, sum(b.sum) as total_teachers, sum(a.sum) as attendace_marked from datasets.sch_att_total_teachers_daily_school as b join datasets.sch_att_teachers_marked_daily_school as a on a.school_id = b.school_id and a.date = b.date join dimensions.school as e on a.school_id = e.school_id where a.date between startDate and endDate group by a.school_id,e.school_name"
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "table": "select school_name, dense_rank() over(order by avg(percentage) desc) as rank ,round(percentage ,0) as percentage  from ingestion.sac_stds_avg_atd_by_school as t left join ingestion.dimension_school as s on t.school_id = s.school_id left join (select distinct(school_id), cluster_id from ingestion.dimension_master) as m on m.school_id = t.school_id where cluster_id = {cluster_id} group by t.school_id, school_name,t.percentage",
    //                 },
    //                 "level": "class"
    //             }
    //         },
    //         // {
    //         //     "name": "Grade",
    //         //     "labelProp": "grade",
    //         //     "valueProp": "grade",
    //         //     "hierarchyLevel": "6",
    //         //     "timeSeriesQueries": {
    //         //         "table": "select grade_number, ceil(round(CAST(avg(a.teachers_present/a.teachers_marked)*100 as numeric),2)) as perc_teachers, dense_rank() over(order by ceil(round(CAST(COALESCE(avg(a.teachers_present/NULLIF(a.teachers_marked, 0))*100) as numeric),2)) desc) as rank from (select present_table.grade_state, present_table.school_id,present_table.date as att_date,present_table.sum as teachers_present,marked_table.sum as teachers_marked from datasets.sch_att_teacherspresent_daily_gender0school0grade as present_table join datasets.sch_att_teachersmarked_daily_gender0school0grade as marked_table on present_table.date = marked_table.date and present_table.school_id = marked_table.school_id and present_table.grade_state = marked_table.grade_state ) as a join dimensions.grade as grade_wise_table on grade_wise_table.grade_id = a.grade_state where school_id = {school_id} and a.att_date between startDate and endDate group by a.grade_state, grade_number",
    //         //     },
    //         //     "actions": {
    //         //         "queries": {
    //         //             "table": "select t.grade, dense_rank() over(order by avg(percentage) desc) as rank ,round(percentage ,0) as percentage  from ingestion.sac_stds_avg_atd_by_grade as t where school_id = {school_id} group by t.grade,t.percentage",
    //         //         },
    //         //         "level": "class"
    //         //     }
    //         // }
    //     ],
    //     "options": {
    //         "table": {
    //             "columns": [
    //                 {
    //                     name: "State",
    //                     property: "state_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "District",
    //                     property: "district_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "Block",
    //                     property: "block_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "Cluster",
    //                     property: "cluster_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "School",
    //                     property: "school_name",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "Grade",
    //                     property: "grade_number",
    //                     class: "text-center"
    //                 },
    //                 {
    //                     name: "% Teachers Reporting Attendance",
    //                     property: "compliance_percentage",
    //                     valueSuffix: '%',
    //                     class: "text-center",
    //                     isHeatMapRequired: true,
    //                     color: {
    //                         type: "percentage",
    //                         values: [
    //                             {
    //                                 color: "#007000",
    //                                 breakPoint: 70
    //                             },
    //                             {
    //                                 color: "#FFBF00",
    //                                 breakPoint: 40
    //                             },
    //                             {
    //                                 color: "#D2222D",
    //                                 breakPoint: 0
    //                             }
    //                         ]
    //                     },
    //                 },
    //                 {
    //                     name: "Rank in % Teachers Reporting Attendance",
    //                     property: "rank",
    //                     class: "text-center",
    //                     isHeatMapRequired: true,
    //                     color: '#fff'
    //                 },

    //             ],
    //         }
    //     }
    // },

 tas_average_attendance_rank: {
        "label": "Average Teachers Present",
        "defaultLevel": "district",
        "filters": [
            {
                "name": "District",
                "labelProp": "district_name",
                "valueProp": "district_id",
                "hierarchyLevel": "2",
                "timeSeriesQueries": {
                    "table": "select district_name, ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers, dense_rank() over(order by ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) desc) as rank from  (select present_table.district_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_district as present_table join datasets.sch_att_total_teachers_daily_district as total_teachers on present_table.date = total_teachers.date and present_table.district_id = total_teachers.district_id) as a join dimensions.district as district_wise_table on district_wise_table.district_id = a.district_id where a.att_date between startDate and endDate group by a.district_id, district_name",
                },
                "actions": {
                    "queries": {
                        "table": "select district_name, dense_rank() over(order by avg(percentage) desc) as rank ,round(percentage ,0) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_district as d on t.district_id = d.district_id left join (select distinct(district_id), state_id from ingestion.dimension_master) as m on m.district_id = t.district_id where state_id = {state_id} group by t.district_id, district_name,t.percentage",
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
                    "table": "select block_name, ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers, dense_rank() over(order by ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) desc) as rank from  (select present_table.block_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_block as present_table join datasets.sch_att_total_teachers_daily_block as total_teachers on present_table.date = total_teachers.date and present_table.block_id = total_teachers.block_id) as a join dimensions.block as block_wise_table on block_wise_table.block_id = a.block_id where a.att_date between startDate and endDate and district_id = {district_id} group by a.block_id, block_name",
                },
                "actions": {
                    "queries": {
                        "table": "select block_name, dense_rank() over(order by avg(percentage) desc) as rank ,round(percentage ,0) as percentage from ingestion.sac_stds_avg_atd_by_block as t left join ingestion.dimension_block as b on t.block_id = b.block_id left join (select distinct(block_id), district_id from ingestion.dimension_master) as m on m.block_id = t.block_id where district_id = {district_id} group by t.block_id, block_name,t.percentage",
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
                    "table": "select cluster_name, ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers, dense_rank() over(order by ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) desc) as rank from  (select present_table.cluster_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_cluster as present_table join datasets.sch_att_total_teachers_daily_cluster as total_teachers on present_table.date = total_teachers.date and present_table.cluster_id = total_teachers.cluster_id) as a join dimensions.cluster as cluster_wise_table on cluster_wise_table.cluster_id = a.cluster_id where block_id = {block_id} and a.att_date between startDate and endDate group by a.cluster_id, cluster_name",
                },
                "actions": {
                    "queries": {
                        "table": "select cluster_name, dense_rank() over(order by avg(percentage) desc) as rank,round(percentage ,0) as percentage  from ingestion.sac_stds_avg_atd_by_cluster as t left join ingestion.dimension_cluster as c on t.cluster_id = c.cluster_id left join (select distinct(cluster_id), block_id from ingestion.dimension_master) as m on m.cluster_id = t.cluster_id where block_id = {block_id} group by t.cluster_id, cluster_name,t.percentage",
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
            //         "table": "select school_name, ceil(round(CAST(COALESCE(avg(a.teachers_present/NULLIF(a.teachers_marked, 0))*100) as numeric),2)) as perc_teachers, dense_rank() over(order by ceil(round(CAST(COALESCE(avg(a.teachers_present/NULLIF(a.teachers_marked, 0))*100) as numeric),2)) desc) as rank from  (select present_table.school_id,present_table.date as att_date,present_table.sum as teachers_present,marked_table.sum as teachers_marked from datasets.sch_att_teachers_marked_present_daily_school as present_table join datasets.sch_att_teachers_marked_daily_school as marked_table on present_table.date = marked_table.date and present_table.school_id = marked_table.school_id) as a join dimensions.school as school_wise_table on school_wise_table.school_id = a.school_id where cluster_id = {cluster_id} and a.att_date between startDate and endDate group by a.school_id, school_name",
            //     },
            //     "actions": {
            //         "queries": {
            //             "table": "select school_name, dense_rank() over(order by avg(percentage) desc) as rank ,round(percentage ,0) as percentage  from ingestion.sac_stds_avg_atd_by_school as t left join ingestion.dimension_school as s on t.school_id = s.school_id left join (select distinct(school_id), cluster_id from ingestion.dimension_master) as m on m.school_id = t.school_id where cluster_id = {cluster_id} group by t.school_id, school_name,t.percentage",
            //         },
            //         "level": "class"
            //     }
            // },
            // {
            //     "name": "Grade",
            //     "labelProp": "grade",
            //     "valueProp": "grade",
            //     "hierarchyLevel": "6",
            //     "timeSeriesQueries": {
            //         "table": "select grade_number, ceil(round(CAST(avg(a.teachers_present/a.teachers_marked)*100 as numeric),2)) as perc_teachers, dense_rank() over(order by ceil(round(CAST(COALESCE(avg(a.teachers_present/NULLIF(a.teachers_marked, 0))*100) as numeric),2)) desc) as rank from (select present_table.grade_state, present_table.school_id,present_table.date as att_date,present_table.sum as teachers_present,marked_table.sum as teachers_marked from datasets.sch_att_teacherspresent_daily_gender0school0grade as present_table join datasets.sch_att_teachersmarked_daily_gender0school0grade as marked_table on present_table.date = marked_table.date and present_table.school_id = marked_table.school_id and present_table.grade_state = marked_table.grade_state ) as a join dimensions.grade as grade_wise_table on grade_wise_table.grade_id = a.grade_state where school_id = {school_id} and a.att_date between startDate and endDate group by a.grade_state, grade_number",
            //     },
            //     "actions": {
            //         "queries": {
            //             "table": "select t.grade, dense_rank() over(order by avg(percentage) desc) as rank ,round(percentage ,0) as percentage  from ingestion.sac_stds_avg_atd_by_grade as t where school_id = {school_id} group by t.grade,t.percentage",
            //         },
            //         "level": "class"
            //     }
            // }
        ],
        "options": {
            "table": {
                "columns": [
                    {
                        name: "State",
                        property: "state_name",
                        class: "text-left"
                    },
                    {
                        name: "District",
                        property: "district_name",
                        class: "text-left"
                    },
                    {
                        name: "Block",
                        property: "block_name",
                        class: "text-left"
                    },
                    {
                        name: "Cluster",
                        property: "cluster_name",
                        class: "text-left"
                    },
                    {
                        name: "School",
                        property: "school_name",
                        class: "text-left"
                    },
                    {
                        name: "Grade",
                        property: "grade_number",
                        class: "text-left"
                    },
                    {
                        name: "% Teachers Present",
                        property: "perc_teachers",
                        valueSuffix: '%',
                        class: "text-center",
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
                    },
                    {
                        name: "Rank in % Teachers Present",
                        property: "rank",
                        class: "text-center",
                        isHeatMapRequired: true,
                        color: '#fff'
                    },

                ],
            }
        }
    },
    tas_average_attendance: {
        "label": "Average Teachers Present",
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "table":`SELECT
                    tt.district_id,
                    d.district_name,
                    CEIL(ROUND(CAST((SUM(tp.sum) / SUM(tt.sum)) * 100 AS NUMERIC),0)) AS perc_teachers
                FROM
                    datasets.staffattendance_total_teachers_Daily_district AS tt
                JOIN
                    datasets.staffattendance_total_teachers_present_Daily_district AS tp ON tt.district_id = tp.district_id AND tt.date = tp.date
                JOIN
                    dimensions.district AS d ON tt.district_id = d.district_id
                WHERE
                    tt.date BETWEEN startDate AND endDate
                GROUP BY
                    tt.district_id,
                    d.district_name
                ORDER BY
                    tt.district_id;`,
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        tt.district_id,
                        d.district_name,
                        CEIL(ROUND(CAST((SUM(tp.sum) / SUM(tt.sum)) * 100 AS NUMERIC),0)) AS perc_teachers
                    FROM
                        datasets.staffattendance_total_teachers_Daily_district AS tt
                    JOIN
                        datasets.staffattendance_total_teachers_present_Daily_district AS tp ON tt.district_id = tp.district_id AND tt.date = tp.date
                    JOIN
                        dimensions.district AS d ON tt.district_id = d.district_id
                    WHERE
                        tt.date BETWEEN startDate AND endDate
                    GROUP BY
                        tt.district_id,
                        d.district_name
                    ORDER BY
                        tt.district_id;`,
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
                    b.district_id,
                    b.district_name,
                    tt.block_id,
                    b.block_name,
                    CEIL(ROUND(CAST((SUM(tp.sum) / SUM(tt.sum)) * 100 AS NUMERIC),0)) AS perc_teachers
                    from
                    datasets.staffattendance_total_teachers_Daily_block as tt
                    JOIN
                    datasets.staffattendance_total_teachers_present_Daily_block as tp on tt.block_id = tp.block_id and tt.date = tp.date
                    LEFT JOIN
                    dimensions.block as b on tt.block_id = b.block_id
                    LEFT Join
                    dimensions.district as d on b.district_id = d.district_id
                    Where tt.date BETWEEN startDate AND endDate and b.district_id = {district_id}
                    Group by
                    b.district_id,
                    b.district_name,
                    tt.block_id,
                    b.block_name
                    ORDER BY
                    tt.block_id;`,
                },
                "actions": {
                    "queries": {
                        "table": `select
                        b.district_id,
                        b.district_name,
                        tt.block_id,
                        b.block_name,
                        CEIL(ROUND(CAST((SUM(tp.sum) / SUM(tt.sum)) * 100 AS NUMERIC),0)) AS perc_teachers
                        from
                        datasets.staffattendance_total_teachers_Daily_block as tt
                        JOIN
                        datasets.staffattendance_total_teachers_present_Daily_block as tp on tt.block_id = tp.block_id and tt.date = tp.date
                        LEFT JOIN
                        dimensions.block as b on tt.block_id = b.block_id
                        LEFT Join
                        dimensions.district as d on b.district_id = d.district_id
                        Where tt.date BETWEEN startDate AND endDate and b.district_id = {district_id}
                        Group by
                        b.district_id,
                        b.district_name,
                        tt.block_id,
                        b.block_name
                        ORDER BY
                        tt.block_id;`,
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
                    "table": "select a.cluster_id, cluster_name, ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from  (select present_table.cluster_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_cluster as present_table join datasets.sch_att_total_teachers_daily_cluster as total_teachers on present_table.date = total_teachers.date and present_table.cluster_id = total_teachers.cluster_id) as a join dimensions.cluster as cluster_wise_table on cluster_wise_table.cluster_id = a.cluster_id where block_id = {block_id} and a.att_date between startDate and endDate group by a.cluster_id, cluster_name order by perc_teachers asc",
                },
                "actions": {
                    "queries": {
                        "table": "select min(date) as min_date, max(date) as max_date, cluster_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_avg_atd_by_cluster as t left join ingestion.dimension_master as m on t.cluster_id = m.cluster_id left join ingestion.dimension_cluster as c on t.cluster_id = c.cluster_id left join ingestion.dimension_block as b on m.block_id = b.block_id left join ingestion.dimension_district as d on m.district_id = d.district_id where m.block_id={block_id} group by t.cluster_id,cluster_name,block_name,district_name",
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
                    "table": "select  school.school_id,  school.school_name, ceil(round(cast((sum(teachers_marked_present.sum)/sum(total_teachers.sum) )*100 as numeric),2)) as perc_teachers from datasets.sch_att_teachers_marked_present_daily_school as teachers_marked_present  inner join  datasets.sch_att_total_teachers_daily_school as total_teachers on teachers_marked_present.school_id = total_teachers.school_id and teachers_marked_present.date = total_teachers.date inner join dimensions.school on school.school_id = total_teachers.school_id where total_teachers.date between startDate and endDate and school.cluster_id = {cluster_id} group by  school.school_id,   school_name"
                },
                "actions": {
                    "queries": {
                        "table": "select min(date) as min_date, max(date) as max_date, school_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_avg_atd_by_school as t left join ingestion.dimension_master as m on t.school_id = m.school_id left join ingestion.dimension_district as d on d.district_id = m.district_id left join ingestion.dimension_block as b on b.block_id = m.block_id left join ingestion.dimension_cluster as c on c.cluster_id = m.cluster_id left join ingestion.dimension_school as s on s.school_id = t.school_id where m.cluster_id={cluster_id} group by school_name,cluster_name,block_name,district_name",
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
                                linkedReports: ["tas_average_attendance_barchart", "tas_average_attendance_bignumber", "average_attendance_school"]
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
                                linkedReports: ["tas_average_attendance_barchart", "tas_average_attendance_bignumber", "average_attendance_school"]
                            },
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
                                linkedReports: ["tas_average_attendance_barchart", "tas_average_attendance_bignumber", "average_attendance_school"]
                            },
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
                                linkedReports: ["tas_average_attendance_barchart", "tas_average_attendance_bignumber", "average_attendance_school"]
                            },
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
                        name: "% Teachers Present",
                        property: "perc_teachers",
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

    tas_average_attendance_bignumber: {
        "label": "Average Teachers Present",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "bigNumber": "select ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from (select present_table.district_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_district as present_table join datasets.sch_att_total_teachers_daily_district as total_teachers on present_table.date = total_teachers.date and present_table.district_id = total_teachers.district_id) as a where a.att_date between startDate and endDate",
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
                },
                "actions": {
                    "queries": {
                        "bigNumber": "select ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from  (select present_table.district_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_district as present_table join datasets.sch_att_total_teachers_daily_district as total_teachers on present_table.date = total_teachers.date and present_table.district_id = total_teachers.district_id) as a",
                        // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
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
                    "bigNumber": "select ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from  (select present_table.district_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_district as present_table join datasets.sch_att_total_teachers_daily_district as total_teachers on present_table.date = total_teachers.date and present_table.district_id = total_teachers.district_id) as a join dimensions.district as district_wise_table on district_wise_table.district_id = a.district_id where a.att_date between startDate and endDate and a.district_id = {district_id}",
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_block as t left join ingestion.dimension_master as m on t.block_id = m.block_id left join ingestion.dimension_block as b on t.block_id = b.block_id left join ingestion.dimension_district as d on m.district_id = d.district_id where (date between startDate and endDate) and m.district_id={district_id}"
                },
                "actions": {
                    "queries": {
                        "bigNumber": "select ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from  (select present_table.district_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_district as present_table join datasets.sch_att_total_teachers_daily_district as total_teachers on present_table.date = total_teachers.date and present_table.district_id = total_teachers.district_id) as a join dimensions.district as district_wise_table on district_wise_table.district_id = a.district_id where a.district_id = {district_id}",
                        // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_block as t left join ingestion.dimension_master as m on t.block_id = m.block_id left join ingestion.dimension_block as b on t.block_id = b.block_id left join ingestion.dimension_district as d on m.district_id = d.district_id where (date between startDate and endDate) and m.district_id={district_id}"
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
                    "bigNumber": "select ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from (select present_table.block_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_block as present_table join datasets.sch_att_total_teachers_daily_block as total_teachers on present_table.date = total_teachers.date and present_table.block_id = total_teachers.block_id) as a join dimensions.block as block_wise_table on block_wise_table.block_id = a.block_id where a.block_id = {block_id} and a.att_date between startDate and endDate",
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_cluster as t left join ingestion.dimension_master as m on t.cluster_id = m.cluster_id where (date between startDate and endDate) and m.block_id={block_id}"
                },
                "actions": {
                    "queries": {
                        "bigNumber": "select ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from (select present_table.block_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_block as present_table join datasets.sch_att_total_teachers_daily_block as total_teachers on present_table.date = total_teachers.date and present_table.block_id = total_teachers.block_id) as a join dimensions.block as block_wise_table on block_wise_table.block_id = a.block_id where a.block_id = {block_id}",
                        // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_cluster as t left join ingestion.dimension_master as m on t.cluster_id = m.cluster_id where (date between startDate and endDate) and m.block_id={block_id}"
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
                    "bigNumber": "select ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from  (select present_table.cluster_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_cluster as present_table join datasets.sch_att_total_teachers_daily_cluster as total_teachers on present_table.date = total_teachers.date and present_table.cluster_id = total_teachers.cluster_id) as a join dimensions.cluster as cluster_wise_table on cluster_wise_table.cluster_id = a.cluster_id where a.cluster_id = {cluster_id} and a.att_date between startDate and endDate",
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_school as t left join ingestion.dimension_master as m on t.school_id = m.school_id where (date between startDate and endDate) and m.cluster_id={cluster_id}",
                },
                "actions": {
                    "queries": {
                        "bigNumber": "select ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from  (select present_table.cluster_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_cluster as present_table join datasets.sch_att_total_teachers_daily_cluster as total_teachers on present_table.date = total_teachers.date and present_table.cluster_id = total_teachers.cluster_id) as a join dimensions.cluster as cluster_wise_table on cluster_wise_table.cluster_id = a.cluster_id where a.cluster_id = {cluster_id}",
                        // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_school as t left join ingestion.dimension_master as m on t.school_id = m.school_id where (date between startDate and endDate) and m.cluster_id={cluster_id}",
                    },
                    "level": "school"
                }
            }
        ],
        "options": {
            "bigNumber": {
                "title": "Average Teachers Present",
                "valueSuffix": '%',
                "property": 'perc_teachers'
            }
        }
    },

   

    tas_average_attendance_barchart:{
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "barChart": "select intermediate_table.district_id, intermediate_table.district_name, intermediate_table.district_name as level, ceil(round(cast((sum(intermediate_table.teachers_present_intermediate)/ sum(intermediate_table.total_teachers_intemediate))*100 as numeric),2)) as perc_teachers, ceil(avg(total_teachers_district_wise)) as total_teachers, ceil(avg(s.totalSchools)) as total_schools from( select present_table.district_id, d.district_name, sum(present_table.sum) as teachers_present_intermediate, sum(total_teachers.sum) as total_teachers_intemediate, avg(total_teachers.sum) as total_teachers_district_wise from datasets.sch_att_teachers_marked_present_daily_district as present_table join datasets.sch_att_total_teachers_daily_district as total_teachers on present_table.date = total_teachers.date and present_table.district_id = total_teachers.district_id Join dimensions.district d On present_table.district_id = d.district_id where present_table.date between startDate and endDate group by present_table.district_id, d.district_name) as intermediate_table join(select district_id, count(school_id) as totalSchools from dimensions.school group by district_id) as s on intermediate_table.district_id = s.district_id group by intermediate_table.district_id, intermediate_table.district_name order by perc_teachers asc",
                },
                "actions": {
                    "queries": {
                        "barChart":"SELECT subject,round(cast(AVG(obtained_marks/total_marks)*100 as numeric),2) AS average FROM( SELECT obtained_marks.sum AS obtained_marks, total_marks.sum AS total_marks, obtained_marks.grade_id, obtained_marks.academicyear_id, obtained_marks.subject_id, obtained_marks.exam_id, subject.subject FROM datasets.assessment_obtainedmarks_bWBOdTt2fndsW2k7dSkK AS obtained_marks INNER JOIN datasets.assessment_totalmarks_eTt2dmFxQlM6YwIfCgk5 AS total_marks ON total_marks.school_id = obtained_marks.school_id INNER JOIN dimensions.subject AS subject ON subject.subject_id = obtained_marks.subject_id INNER JOIN dimensions.exam as exam on exam.exam_id=obtained_marks.exam_id INNER JOIN dimensions.grade AS grade ON grade.grade_id = obtained_marks.grade_id) AS student_assessment GROUP BY subject;"
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
                    "barChart": "SELECT Ceil(Round(Cast(( Sum(intermediate_table.teachers_present_intermediate) / Sum( intermediate_table.total_teachers_intemediate)) * 100 AS NUMERIC), 2)) AS perc_teachers, Ceil(Avg(total_teachers_block_wise)) AS total_teachers, Ceil(Avg(s.totalschools)) AS total_schools, intermediate_table.block_id, intermediate_table.block_name, intermediate_table.block_name AS level FROM (SELECT Sum(present_table.sum) AS teachers_present_intermediate, Sum(total_teachers.sum) AS total_teachers_intemediate, present_table.block_id, b.block_name, Avg(total_teachers.sum) AS total_teachers_block_wise FROM datasets.sch_att_teachers_marked_present_daily_block AS present_table JOIN datasets.sch_att_total_teachers_daily_block AS total_teachers ON present_table.date = total_teachers.date AND present_table.block_id = total_teachers.block_id JOIN dimensions.block b ON present_table.block_id = b.block_id WHERE present_table.date between startDate and endDate and b.district_id = {district_id} GROUP BY present_table.block_id, b.block_name) AS intermediate_table JOIN (SELECT block_id, Count(school_id) AS totalSchools FROM dimensions.school GROUP BY block_id) AS s ON intermediate_table.block_id = s.block_id GROUP BY intermediate_table.block_id, intermediate_table.block_name ORDER BY perc_teachers ASC",
                },
                "actions": {
                    "queries": {
                        "barChart":"SELECT subject,round(cast(AVG(obtained_marks/total_marks)*100 as numeric),2) AS average FROM( SELECT obtained_marks.sum AS obtained_marks, total_marks.sum AS total_marks, obtained_marks.subject_id, obtained_marks.grade_id, obtained_marks.exam_id, obtained_marks.academicyear_id, subject.subject, district.district_id FROM datasets.assessment_obtainedmarks_bWBOdTt2fndsW2k7dSkK AS obtained_marks INNER JOIN datasets.assessment_totalmarks_eTt2dmFxQlM6YwIfCgk5 AS total_marks ON total_marks.school_id = obtained_marks.school_id INNER JOIN dimensions.subject AS subject ON subject.subject_id = obtained_marks.subject_id INNER JOIN dimensions.school AS school ON school.school_id = obtained_marks.school_id INNER JOIN dimensions.exam as exam on exam.exam_id=obtained_marks.exam_id INNER JOIN dimensions.grade AS grade ON grade.grade_id = obtained_marks.grade_id INNER JOIN dimensions.district AS district ON district.district_id = school.district_id) AS student_assessment WHERE district_id = {district_id} GROUP BY subject;",
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
                    "barChart": "SELECT Ceil(Round(Cast(( Sum(intermediate_table.teachers_present_intermediate) / Sum( intermediate_table.total_teachers_intemediate)) * 100 AS NUMERIC), 2)) AS perc_teachers, Ceil(Avg(total_teachers_cluster_wise)) AS total_teachers, Ceil(Avg(s.totalschools)) AS total_schools, intermediate_table.cluster_id, intermediate_table.cluster_name, intermediate_table.cluster_name AS level FROM (SELECT Sum(present_table.sum) AS teachers_present_intermediate, Sum(total_teachers.sum) AS total_teachers_intemediate, present_table.cluster_id, c.cluster_name, Avg(total_teachers.sum) AS total_teachers_cluster_wise FROM datasets.sch_att_teachers_marked_present_daily_cluster AS present_table JOIN datasets.sch_att_total_teachers_daily_cluster AS total_teachers ON present_table.date = total_teachers.date AND present_table.cluster_id = total_teachers.cluster_id JOIN dimensions.cluster c ON present_table.cluster_id = c.cluster_id WHERE present_table.date BETWEEN startDate and endDate AND c.block_id = {block_id} GROUP BY present_table.cluster_id, c.cluster_name) AS intermediate_table JOIN (SELECT cluster_id, Count(school_id) AS totalSchools FROM dimensions.school GROUP BY cluster_id) AS s ON intermediate_table.cluster_id = s.cluster_id GROUP BY intermediate_table.cluster_id, intermediate_table.cluster_name ORDER BY perc_teachers ASC",
                },
                "actions": {
                    "queries": {
                        "barChart":"SELECT subject,round(cast(AVG(obtained_marks/total_marks)*100 as numeric),2) AS average FROM( SELECT obtained_marks.sum AS obtained_marks, total_marks.sum AS total_marks, obtained_marks.subject_id, obtained_marks.grade_id, obtained_marks.exam_id, obtained_marks.academicyear_id, subject.subject, block.block_id FROM datasets.assessment_obtainedmarks_bWBOdTt2fndsW2k7dSkK AS obtained_marks INNER JOIN datasets.assessment_totalmarks_eTt2dmFxQlM6YwIfCgk5 AS total_marks ON total_marks.school_id = obtained_marks.school_id INNER JOIN dimensions.subject AS subject ON subject.subject_id = obtained_marks.subject_id INNER JOIN dimensions.school AS school ON school.school_id = obtained_marks.school_id INNER JOIN dimensions.exam as exam on exam.exam_id=obtained_marks.exam_id INNER JOIN dimensions.grade AS grade ON grade.grade_id = obtained_marks.grade_id INNER JOIN dimensions.block AS block ON block.block_id = school.block_id) AS student_assessment WHERE block_id = {block_id} GROUP BY subject;"
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
                    "barChart": "SELECT school_name AS level, school_name, a.school_id, Ceil(Avg(total_teachers_school_wise)) AS total_teachers, Ceil(Round(Cast(( Sum(a.teachers_present) / Sum(a.total_teachers)) * 100 AS NUMERIC) , 2)) AS perc_teachers FROM(SELECT present_table.school_id, sum(present_table.sum) AS teachers_present, sum(total_teachers.sum) AS total_teachers, Avg(total_teachers.sum) AS total_teachers_school_wise FROM datasets.sch_att_teachers_marked_present_daily_school AS present_table JOIN datasets.sch_att_total_teachers_daily_school AS total_teachers ON present_table.date = total_teachers.date AND present_table.school_id = total_teachers.school_id where present_table.date BETWEEN startDate AND endDate group by present_table.school_id ) AS a JOIN dimensions.school AS school_wise_table ON school_wise_table.school_id = a.school_id where cluster_id = {cluster_id} GROUP BY a.school_id, school_name ORDER BY perc_teachers ASC",
                },
                "actions": {
                    "queries": {
                        "barChart":"SELECT subject,round(cast(AVG(obtained_marks/total_marks)*100 as numeric),2) AS average FROM( SELECT obtained_marks.sum AS obtained_marks, total_marks.sum AS total_marks, obtained_marks.subject_id, obtained_marks.grade_id, obtained_marks.exam_id, obtained_marks.academicyear_id, subject.subject, cluster.cluster_id FROM datasets.assessment_obtainedmarks_bWBOdTt2fndsW2k7dSkK AS obtained_marks INNER JOIN datasets.assessment_totalmarks_eTt2dmFxQlM6YwIfCgk5 AS total_marks ON total_marks.school_id = obtained_marks.school_id INNER JOIN dimensions.subject AS subject ON subject.subject_id = obtained_marks.subject_id INNER JOIN dimensions.school AS school ON school.school_id = obtained_marks.school_id INNER JOIN dimensions.exam as exam on exam.exam_id=obtained_marks.exam_id INNER JOIN dimensions.grade AS grade ON grade.grade_id = obtained_marks.grade_id INNER JOIN dimensions.cluster AS cluster ON cluster.cluster_id = school.cluster_id) AS student_assessment WHERE cluster_id = {cluster_id} GROUP BY subject;"
                    },
                    "level": "school"
                }
            },

        ],
        "options": {
            "barChart": {
                "metricLabelProp": "% Teacher Present",
                "metricValueProp": "perc_teachers",
                "yAxis": {
                    "title": "Attendance %"
                },
                "benchmarkConfig": {
                    "linkedReport": "tas_average_attendance_bignumber"
                },
                "xAxis": {
                    "title": " ",
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
                        "valuePrefix": "School Name: ",
                        "value": "school_name",
                        "valueSuffix": ""
                    },
                    {
                        "valuePrefix": "Total Number of Schools: ",
                        "value": "total_schools",
                        "valueSuffix": ""
                    },
                    {
                        "valuePrefix": "Total Number of Teachers: ",
                        "value": "total_teachers",
                        "valueSuffix": ""
                    },
                    {
                        "valuePrefix": "Average percentage of attendance: ",
                        "value": "perc_teachers",
                        "valueSuffix": "%"
                    },
                ]
            }
        }
    },

    average_attendance_school: {
        "label": "Average Teachers Present",
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "table": "select  school.school_id,  udise_code, school.school_name,        district_name,        block_name,        cluster_name ,       sum(total_teachers.sum) as total_teachers,  sum(teachers_marked_present.sum) as teachers_marked_present,   ceil(round(cast((sum(teachers_marked_present.sum)/sum(total_teachers.sum) )*100 as numeric),2)) as perc_teachers from datasets.sch_att_teachers_marked_present_daily_school as teachers_marked_present  inner join  datasets.sch_att_total_teachers_daily_school as total_teachers on teachers_marked_present.school_id = total_teachers.school_id and teachers_marked_present.date = total_teachers.date inner join dimensions.school on school.school_id = total_teachers.school_id where total_teachers.date between startDate and endDate group by  school.school_id, udise_code,  school_name,    district_name,    block_name,    cluster_name;"
                },
                "actions": {
                    "queries": {
                        "table": "select min(date) as min_date, max(date) as max_date, district_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id left join ingestion.dimension_district as d on t.district_id = d.district_id where m.state_id = {state_id} group by t.district_id ,district_name",
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
                    "table": "select  school.school_id, udise_code, school.school_name,        district_name,        block_name,        cluster_name ,       sum(total_teachers.sum) as total_teachers,  sum(teachers_marked_present.sum) as teachers_marked_present,   ceil(round(cast((sum(teachers_marked_present.sum)/sum(total_teachers.sum) )*100 as numeric),2)) as perc_teachers from datasets.sch_att_teachers_marked_present_daily_school as teachers_marked_present  inner join  datasets.sch_att_total_teachers_daily_school as total_teachers on teachers_marked_present.school_id = total_teachers.school_id and teachers_marked_present.date = total_teachers.date inner join dimensions.school on school.school_id = total_teachers.school_id where total_teachers.date between startDate and endDate and school.district_id = {district_id} group by  school.school_id, udise_code,  school_name,    district_name,    block_name,    cluster_name;"
                },
                "actions": {
                    "queries": {
                        "table": "select min(date) as min_date, max(date) as max_date, block_name, round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_block as t left join ingestion.dimension_master as m on t.block_id = m.block_id left join ingestion.dimension_block as b on t.block_id = b.block_id left join ingestion.dimension_district as d on m.district_id = d.district_id where m.district_id={district_id} group by t.block_id,block_name,district_name",
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
                    "table": "select  school.school_id, udise_code, school.school_name,        district_name,        block_name,        cluster_name ,       sum(total_teachers.sum) as total_teachers,  sum(teachers_marked_present.sum) as teachers_marked_present,   ceil(round(cast((sum(teachers_marked_present.sum)/sum(total_teachers.sum) )*100 as numeric),2)) as perc_teachers from datasets.sch_att_teachers_marked_present_daily_school as teachers_marked_present  inner join  datasets.sch_att_total_teachers_daily_school as total_teachers on teachers_marked_present.school_id = total_teachers.school_id and teachers_marked_present.date = total_teachers.date inner join dimensions.school on school.school_id = total_teachers.school_id where total_teachers.date between startDate and endDate and school.block_id = {block_id} group by  school.school_id,  udise_code, school_name,    district_name,    block_name,    cluster_name;"
                },
                "actions": {
                    "queries": {
                        "table": "select min(date) as min_date, max(date) as max_date, cluster_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_avg_atd_by_cluster as t left join ingestion.dimension_master as m on t.cluster_id = m.cluster_id left join ingestion.dimension_cluster as c on t.cluster_id = c.cluster_id left join ingestion.dimension_block as b on m.block_id = b.block_id left join ingestion.dimension_district as d on m.district_id = d.district_id where m.block_id={block_id} group by t.cluster_id,cluster_name,block_name,district_name",
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
                    "table": "select  school.school_id, udise_code, school.school_name,        district_name,        block_name,        cluster_name ,       sum(total_teachers.sum) as total_teachers,  sum(teachers_marked_present.sum) as teachers_marked_present,   ceil(round(cast((sum(teachers_marked_present.sum)/sum(total_teachers.sum) )*100 as numeric),2)) as perc_teachers from datasets.sch_att_teachers_marked_present_daily_school as teachers_marked_present  inner join  datasets.sch_att_total_teachers_daily_school as total_teachers on teachers_marked_present.school_id = total_teachers.school_id and teachers_marked_present.date = total_teachers.date  inner join dimensions.school on school.school_id = total_teachers.school_id where total_teachers.date between startDate and endDate and school.cluster_id = {cluster_id} group by  school.school_id, udise_code,  school_name,    district_name,    block_name,    cluster_name;"
                },
                "actions": {
                    "queries": {
                        "table": "select min(date) as min_date, max(date) as max_date, school_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_avg_atd_by_school as t left join ingestion.dimension_master as m on t.school_id = m.school_id left join ingestion.dimension_district as d on d.district_id = m.district_id left join ingestion.dimension_block as b on b.block_id = m.block_id left join ingestion.dimension_cluster as c on c.cluster_id = m.cluster_id left join ingestion.dimension_school as s on s.school_id = t.school_id where m.cluster_id={cluster_id} group by school_name,cluster_name,block_name,district_name",
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
                        class: "text-left"
                    },
                    {
                        name: "Block",
                        property: "block_name",
                        class: "text-left"
                    },
                    {
                        name: "Cluster",
                        property: "cluster_name",
                        class: "text-left"
                    },
                    {
                        name: "UDISE Code",
                        property: "udise_code",
                        class: "text-left"
                    },
                    {
                        name: "School",
                        property: "school_name",
                        class: "text-left"
                    },
                    {
                        name: "% Teachers Present",
                        property: "perc_teachers",
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
                "title": "UDISE Code",
                "searchProps": ['udise_code'],
                "searchType": "number"
            },
        }
    },

    tas_trendline_chart: {
        "label": "Trend Line",
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "table": "SELECT a.att_date, Ceil(Round(Cast(COALESCE(Avg(a.teachers_present / NULLIF(a.total_teachers, 0)) * 100) AS NUMERIC), 2)) AS perc_teachers FROM(SELECT present_table.district_id, present_table.date AS att_date, present_table.sum AS teachers_present, total_teachers.sum AS total_teachers FROM datasets.sch_att_teachers_marked_present_daily_district AS present_table JOIN datasets.sch_att_total_teachers_daily_district AS total_teachers ON present_table.date = total_teachers.date AND present_table.district_id = total_teachers.district_id) AS a WHERE a.att_date BETWEEN startDate AND endDate group by a.att_date order by a.att_date asc"
                },
                "actions": {
                    "queries": {
                        "table": "select min(date) as min_date, max(date) as max_date, district_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id left join ingestion.dimension_district as d on t.district_id = d.district_id where m.state_id = {state_id} group by t.district_id ,district_name",
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
                    "table": "select a.att_date, ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from(select present_table.block_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_block as present_table join datasets.sch_att_total_teachers_daily_block as total_teachers on present_table.date = total_teachers.date and present_table.block_id = total_teachers.block_id) as a join dimensions.block as block_wise_table on block_wise_table.block_id = a.block_id where district_id = {district_id} and a.att_date between startDate and endDate group by a.att_date order by a.att_date asc"
                },
                "actions": {
                    "queries": {
                        "table": "select min(date) as min_date, max(date) as max_date, block_name, round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_block as t left join ingestion.dimension_master as m on t.block_id = m.block_id left join ingestion.dimension_block as b on t.block_id = b.block_id left join ingestion.dimension_district as d on m.district_id = d.district_id where m.district_id={district_id} group by t.block_id,block_name,district_name",
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
                    "table": "select a.att_date, ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from(select present_table.cluster_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_cluster as present_table join datasets.sch_att_total_teachers_daily_cluster as total_teachers on present_table.date = total_teachers.date and present_table.cluster_id = total_teachers.cluster_id) as a join dimensions.cluster as cluster_wise_table on cluster_wise_table.cluster_id = a.cluster_id where block_id = {block_id} and a.att_date between startDate and endDate group by a.att_date order by a.att_date asc"
                },
                "actions": {
                    "queries": {
                        "table": ""
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
                    "table": "select a.att_date, ceil(round(cast((sum(a.teachers_present)/sum(a.total_teachers))*100 as numeric),2)) as perc_teachers from  (select present_table.school_id,present_table.date as att_date,present_table.sum as teachers_present,total_teachers.sum as total_teachers from datasets.sch_att_teachers_marked_present_daily_school as present_table join datasets.sch_att_total_teachers_daily_school as total_teachers on present_table.date = total_teachers.date and present_table.school_id = total_teachers.school_id) as a join dimensions.school as school_wise_table on school_wise_table.school_id = a.school_id where cluster_id = {cluster_id} and a.att_date between startDate and endDate group by a.att_date order by a.att_date asc"
                },
                "actions": {
                    "queries": {
                        "table": "select min(date) as min_date, max(date) as max_date, school_name, round(avg(percentage),0) as percentage from ingestion.sac_stds_avg_atd_by_school as t left join ingestion.dimension_master as m on t.school_id = m.school_id left join ingestion.dimension_district as d on d.district_id = m.district_id left join ingestion.dimension_block as b on b.block_id = m.block_id left join ingestion.dimension_cluster as c on c.cluster_id = m.cluster_id left join ingestion.dimension_school as s on s.school_id = t.school_id where m.cluster_id={cluster_id} group by school_name,cluster_name,block_name,district_name",
                    },
                    "level": "school"
                }
            }
        ],
        "options": {
            "table": {
                "columns": [
                    {
                        name: "date",
                        property: "att_date",
                        class: "text-center"
                    },
                    {
                        name: "avarage",
                        property: "perc_teachers",
                        class: "text-center",
                    }
                ],
            }
        }
    },

    teacher_average_table: {
        "label": "Average Score",
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
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.district d ON ts.district_id = d.district_id
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
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate
                    GROUP BY
                        ts.district_id, d.district_name;`                       ,
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
                    
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND b.district_id = {district_id}
                GROUP BY
                    ts.block_id,
                    b.block_name,b.district_id; `,
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        ts.block_id,
                        b.block_name,
                        b.district_id,
                       
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
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
                    
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND c.block_id = {block_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    b.district_id;
                    `,
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        
                        b.district_id,
                        
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    JOIN
                        dimensions.block b ON c.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND c.block_id = {block_id}
                    GROUP BY
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        b.district_id;
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
                    "table": `SELECT
                    ts.school_id,
                    sch.school_name,
                    sch.cluster_id,
                    
                    c.block_id,
                    
                    b.district_id,
                  
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.school sch ON sch.school_id = ts.school_id
                JOIN
                    dimensions.cluster c ON sch.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                GROUP BY
                   ts.school_id,
                    sch.school_name,
                    sch.cluster_id,
                    
                    c.block_id,
                    b.district_id;`
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        ts.school_id,
                        sch.school_name,
                        sch.cluster_id,
                        
                        c.block_id,
                        
                        b.district_id,
                      
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.school sch ON sch.school_id = ts.school_id
                    JOIN
                        dimensions.cluster c ON sch.cluster_id = c.cluster_id
                    JOIN
                        dimensions.block b ON c.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                    GROUP BY
                       ts.school_id,
                        sch.school_name,
                        sch.cluster_id,
                        
                        c.block_id,
                        b.district_id;`,
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
                                linkedReports: ["teacher_bignumber", "teacher_average_school","teacher_barchart","teacher_trendchart"]
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
                                linkedReports: ["teacher_bignumber", "teacher_average_school","teacher_barchart","teacher_trendchart"]
                            },
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
                                linkedReports: ["teacher_bignumber", "teacher_average_school","teacher_barchart","teacher_trendchart"]
                            },
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
                                linkedReports: ["teacher_bignumber", "teacher_average_school","teacher_barchart","teacher_trendchart"]
                            },
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
                        name: "% Present Teachers ",
                        property: "perc_teachers",
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
    teacher_bignumber: {
        "label": "Average Score",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "bigNumber": `SELECT 
                    ROUND(AVG(perc_teachers)) AS perc_teachers
                    from (SELECT 
                    ts.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate
                GROUP BY
                    ts.district_id, d.district_name) AS avg_query;`

                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_teachers)) AS perc_teachers
                        from (SELECT 
                        ts.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.district d ON ts.district_id = d.district_id
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
                    ROUND(AVG(perc_teachers)) AS perc_teachers
                    from (SELECT 
                    ts.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.district_id ={district_id}
                GROUP BY
                    ts.district_id, d.district_name) AS avg_query;`
                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_teachers)) AS perc_teachers
                        from (SELECT 
                        ts.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.district d ON ts.district_id = d.district_id
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
                    ROUND(AVG(perc_teachers)) AS perc_teachers
                    from (SELECT
                    ts.block_id,
                    b.block_name,
                    b.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                GROUP BY
                    ts.block_id,
                    b.block_name,b.district_id, d.district_name) AS avg_query;`,
                    
                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_teachers)) AS perc_teachers
                        from (SELECT
                        ts.block_id,
                        b.block_name,
                        b.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
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
                    ROUND(AVG(perc_teachers)) AS perc_teachers
                    from (SELECT
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    b.block_name,
                    b.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.cluster_id = {cluster_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    b.block_name,b.district_id, d.district_name) AS avg_query;
                
                
                `,
                   
                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_teachers)) AS perc_teachers
                        from (SELECT
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        b.block_name,
                        b.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    JOIN
                        dimensions.block b ON c.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND ts.cluster_id = {cluster_id}
                    GROUP BY
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        b.block_name,b.district_id, d.district_name) AS avg_query;
                    
                    
                    `,
                        
                    },
                    "level": "school"
                }
            }
        ],
        "options": {
            "bigNumber": {
                "title": "Average Teacher Present",
                "valueSuffix": '%',
                "property": 'perc_teachers'
            }
        }
    },
    teacher_average_school: {
        "label": "Average Teachers Present",
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "table": `select
                    ts.district_id,d.district_name,
                    ts.school_id, sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    from
                    teacher_attendance.teaching_staff ts
                    left JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    left JOIN
                    dimensions.cluster c ON sch.cluster_id = c.cluster_id
                    JOIN
                    dimensions.block b ON c.block_id = b.block_id
                    JOIN
                    dimensions.district d ON b.district_id = d.district_id
                    JOIN
                    (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       teacher_attendance.teaching_staff ts
                       where ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date between startDate AND endDate  
                    GROUP BY
                    ts.district_id,d.district_name,
                    ts.school_id, sch.school_name,days_count.total_days
                    order by
                    district_id;
                     `
                },
                "actions": {
                    "queries": {
                        "table": `select
                        ts.district_id,d.district_name,
                        ts.school_id, sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                        from
                        teacher_attendance.teaching_staff ts
                        left JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        left JOIN
                        dimensions.cluster c ON sch.cluster_id = c.cluster_id
                        JOIN
                        dimensions.block b ON c.block_id = b.block_id
                        JOIN
                        dimensions.district d ON b.district_id = d.district_id
                        JOIN
                        (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           teacher_attendance.teaching_staff ts
                           where ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where ts.date between startDate AND endDate  
                        GROUP BY
                        ts.district_id,d.district_name,
                        ts.school_id, sch.school_name,days_count.total_days
                        order by
                        district_id;
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
                    (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    from
                    teacher_attendance.teaching_staff ts
                    left JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    left JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    left JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    left JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       teacher_attendance.teaching_staff ts
                       where ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date between startDate AND endDate AND b.district_id = {district_id}
                    GROUP BY
                    b.district_id,d.district_name,
                    ts.school_id,sch.school_name,days_count.total_days`
                },
                "actions": {
                    "queries": {
                        "table": `select
                        b.district_id,d.district_name,
                        ts.school_id,sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                        from
                        teacher_attendance.teaching_staff ts
                        left JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        left JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        left JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        left JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           teacher_attendance.teaching_staff ts
                           where ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where ts.date between startDate AND endDate AND b.district_id = {district_id}
                        GROUP BY
                        b.district_id,d.district_name,
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
                    
                    ts.school_id,sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    from
                    teacher_attendance.teaching_staff ts
                    left JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    left JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    left JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    left JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       teacher_attendance.teaching_staff ts
                       where ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date between startDate AND endDate AND c.block_id = {block_id}
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
                        (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                        from
                        teacher_attendance.teaching_staff ts
                        left JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        left JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        left JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        left JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           teacher_attendance.teaching_staff ts
                           where ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where ts.date between startDate AND endDate AND c.block_id = {block_id}
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
                    (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                     from
                    teacher_attendance.teaching_staff ts
                    left JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    left JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    left JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    left JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       teacher_attendance.teaching_staff ts
                       where ts.date BETWEEN startDate AND endDate
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
                        (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                         from
                        teacher_attendance.teaching_staff ts
                        left JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        left JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        left JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        left JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           teacher_attendance.teaching_staff ts
                           where ts.date BETWEEN startDate AND endDate
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
                        name: "Total Teachers",
                        property: "total_teachers",
                        class: "text-center"
                    },
                    {
                        name: "Total Teachers Present",
                        property: "present_teachers",
                        class: "text-center"
                    },
                    
                    {
                        name: "% Present Teacher",
                        property: "perc_teachers",
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
    teaching_map:{
        "label": "Map View of Teacher Attendance",
        "filters":
            [
                {
                    "name": "State",
                    "hierarchyLevel": "1",
                    "timeSeriesQueries": {
                        "map": `
                        SELECT 
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_teachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_teachers_percentage
FROM 
   teacher_attendance.staff_map_dis AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.staff_map_dis
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
   dc.total_days;`,
                    },
                    "actions": {
                        "queries": {
                            "map": `SELECT 
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_teachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_teachers_percentage
FROM 
   teacher_attendance.staff_map_dis AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.staff_map_dis
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
   dc.total_days;`
                        },
                        "level": "district"
                    }
                },
                {
                    "name": "District",
                    "hierarchyLevel": "2",
                    "timeSeriesQueries": {
                        "map": `SELECT 
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
    ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_teachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_teachers_percentage
FROM 
   teacher_attendance.staff_map_block AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.staff_map_block
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
                        "queries": {
                            "map": `SELECT 
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
    ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_teachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_teachers_percentage
FROM 
   teacher_attendance.staff_map_block AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.staff_map_block
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
                        "level": "block"
                    }
                },
                {
                    "name": "Block",
                    "hierarchyLevel": "3",
                    "timeSeriesQueries": {
                        "map": `SELECT 
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
     ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_teachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_teachers_percentage
FROM 
   teacher_attendance.staff_map_cluster AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.staff_map_cluster
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
                    "actions": {
                        "queries": {
                            "map": `SELECT 
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
     ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_teachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_teachers_percentage
FROM 
   teacher_attendance.staff_map_cluster AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.staff_map_cluster
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
   dc.total_days;
                            `,
                        },
                        "level": "cluster"
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
    ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_teachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_teachers_percentage
FROM 
   teacher_attendance.staff_map_school AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.staff_map_school
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
   dc.total_days;`,
                    },
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
    ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_teachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_teachers_percentage
FROM 
   teacher_attendance.staff_map_school AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.staff_map_school
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
   dc.total_days;`,
                        },
                        "level": "school"
                    }
                }
            ],
        "options":
        {
            "map":
             {
                // "indicatorType": "percent",
                // "indicator": "perc_teachers",
                // "legend": { "title": " Teachers Availability" },
                "metricFilterNeeded": "true",
                "indicator": 'metric',
                "totalOfPercentage":"total_teachers",
                "indicatorType": "percent",

				"legend": {

					"title": 'Teacher Availability',
                },

                "tooltipMetrics": [
                    {
                        "valuePrefix": "District Id: ",
                        "value": "district_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "District Name: ",
                        "value": "district_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Block Id: ",
                        "value": "block_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Block Name: ",
                        "value": "block_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Cluster Id: ",
                        "value": "cluster_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Cluster Name: ",
                        "value": "cluster_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "School Id: ",
                        "value": "school_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "School Name: ",
                        "value": "school_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Total Teachers Present: ",
                        "value": "percentage_of_teacher_present",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Total Teachers Absent: ",
                        "value": "percentage_of_teacher_absent",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Total Teachers: ",
                        "value": "total_teachers",
                        "valueSuffix": "\n"
                    },
                    
                    {
                        "valuePrefix": "Average Teachers Present: ",
                        "value": "perc_teachers",
                        "valueSuffix": "%\n"
                    },
                    {
                        "valuePrefix": "Average Teachers Absent: ",
                        "value": "absent_teachers_percentage",
                        "valueSuffix": "%\n"
                    }
                ]
            }
        }
    },
    non_teaching_map:{
        "label": "Map View of Non Teaching Staff Attendance",
        "filters":
            [
                {
                    "name": "State",
                    "hierarchyLevel": "1",
                    "timeSeriesQueries": {
                        "map": `SELECT 
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_non_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_nonteachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_non_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_non_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_non_teachers_percentage
FROM 
   teacher_attendance.nonteaching_staff_map_dis AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.nonteaching_staff_map_dis
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
   dc.total_days;`
                    },
                    "actions": {
                        "queries": {
                            "map": `SELECT 
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_non_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_nonteachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_non_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_non_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_non_teachers_percentage
FROM 
   teacher_attendance.nonteaching_staff_map_dis AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.nonteaching_staff_map_dis
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
   dc.total_days;`,
                        },
                        "level": "district"
                    }
                },
                
                {
                    "name": "District",
                    "hierarchyLevel": "2",
                    "timeSeriesQueries": {
                        "map": ` SELECT 
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_non_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_nonteachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_non_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_non_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_non_teachers_percentage
FROM 
   teacher_attendance.nonteaching_staff_map_block AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.nonteaching_staff_map_block
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
                        "queries": {
                            "map": ` SELECT 
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_non_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_nonteachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_non_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_non_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_non_teachers_percentage
FROM 
   teacher_attendance.nonteaching_staff_map_block AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.nonteaching_staff_map_block
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
                        "level": "block"
                    }
                },
                {
                    "name": "Block",
                    "hierarchyLevel": "3",
                    "timeSeriesQueries": {
                        "map": ` SELECT 
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_non_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_nonteachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_non_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_non_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_non_teachers_percentage
FROM 
   teacher_attendance.nonteaching_staff_map_cluster AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.nonteaching_staff_map_cluster
       WHERE 
           date BETWEEN '2024-10-03' AND '2024-10-04'
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN '2024-10-03' AND '2024-10-04' and smd.block_id = '180610'
GROUP BY 
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
                    "actions": {
                        "queries": {
                            "map": ` SELECT 
   smd.cluster_id,
   smd.cluster_name,
   smd.block_id,
   smd.block_name,
   smd.district_id,
   smd.district_name,
   smd.latitude,
   smd.longitude,
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_non_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_nonteachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_non_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_non_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_non_teachers_percentage
FROM 
   teacher_attendance.nonteaching_staff_map_cluster AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.nonteaching_staff_map_cluster
       WHERE 
           date BETWEEN '2024-10-03' AND '2024-10-04'
       GROUP BY 
           district_id
   ) AS dc ON smd.district_id = dc.district_id
WHERE 
   smd.date BETWEEN '2024-10-03' AND '2024-10-04' and smd.block_id = '180610'
GROUP BY 
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
                        "level": "cluster"
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
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_non_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_nonteachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_non_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_non_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_non_teachers_percentage
FROM 
   teacher_attendance.nonteaching_staff_map_school AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.nonteaching_staff_map_school
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
   dc.total_days;`,
                    },
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
   ROUND(SUM(smd.present_staff) / dc.total_days, 2) AS percentage_of_non_teacher_present,
   ROUND(SUM(smd.total_staff) / dc.total_days) AS total_nonteachers,
   ROUND(SUM(smd.absent_staff) / dc.total_days, 2) AS percentage_of_non_teacher_absent,
   ROUND((SUM(smd.present_staff) * 100.0) / SUM(smd.total_staff), 2) AS perc_non_teachers, 
   ROUND((SUM(smd.absent_staff) * 100.0) / SUM(smd.total_staff), 2) AS absent_non_teachers_percentage
FROM 
   teacher_attendance.nonteaching_staff_map_school AS smd
JOIN 
   (
       SELECT 
           district_id,
           COUNT(DISTINCT date) AS total_days
       FROM 
           teacher_attendance.nonteaching_staff_map_school
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
   dc.total_days;`,
                        },
                        "level": "school"
                    }
                }
            ],
        "options":
        {
            "map":
             {
                // "indicatorType": "percent",
                // "indicator": "perc_teachers",
                // "legend": { "title": " Average Non Teachers Present" },
                "metricFilterNeeded": "true",
                "indicator": 'metric',
                "totalOfPercentage":"total_nonteachers",
                "indicatorType": "percent",

				"legend": {

					"title": 'Average Non Teachers Present',
                },

                "tooltipMetrics": [
                    {
                        "valuePrefix": "District Id: ",
                        "value": "district_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "District Name: ",
                        "value": "district_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Block Id: ",
                        "value": "block_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Block Name: ",
                        "value": "block_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Cluster Id: ",
                        "value": "cluster_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Cluster Name: ",
                        "value": "cluster_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "School Id: ",
                        "value": "school_id",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "School Name: ",
                        "value": "school_name",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Total Non-Teaching Present: ",
                        "value": "percentage_of_non_teacher_present",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Total Non Teaching Absent: ",
                        "value": "percentage_of_non_teacher_absent",
                        "valueSuffix": "\n"
                    },
                    {
                        "valuePrefix": "Total Non Teaching Staff: ",
                        "value": "total_nonteachers",
                        "valueSuffix": "\n"
                    },
                    // {
                    //     "valuePrefix": "Total Teachers: ",
                    //     "value": "total_teachers",
                    //     "valueSuffix": "\n"
                    // },
                    // {
                    //     "valuePrefix": "Total Teachers Present: ",
                    //     "value": "teachers_present",
                    //     "valueSuffix": "\n"
                    // },
                    {
                        "valuePrefix": "Average Non Teachers Present: ",
                        "value": "perc_non_teachers",
                        "valueSuffix": "%\n"
                    },
                    {
                        "valuePrefix": "Average Non Teachers Absent: ",
                        "value": "absent_non_teachers_percentage",
                        "valueSuffix": "%\n"
                    }
                ]
            }
        }
    },
    outside_bignumber: {
        "label": "Average Teachers Present",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "bigNumber": 
                    `select ROUND((sum_attendance * 100.0 / count_attendance),2) AS teaching_present
                    FROM teacher_attendance.dash WHERE date = (SELECT MAX(date) FROM teacher_attendance.dash);`,
                    // `SELECT
                    // ROUND(sum(ts.attendance_status) * 100 / count(ts.attendance_status),2) AS teaching_present
                    // FROM teacher_attendance.teaching_staff ts
                    // WHERE date = (SELECT MAX(date) FROM teacher_attendance.teaching_staff)`,
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
                },
                "actions": {
                    "queries": {
                        "bigNumber": 
                       `select ROUND((sum_attendance * 100.0 / count_attendance),2) AS teaching_present
                        FROM teacher_attendance.dash WHERE date = (SELECT MAX(date) FROM teacher_attendance.dash);`,
                        // `SELECT
                        // ROUND(sum(ts.attendance_status) * 100 / count(ts.attendance_status),2) AS teaching_present
                        // FROM teacher_attendance.teaching_staff ts
                        // WHERE date = (SELECT MAX(date) FROM teacher_attendance.teaching_staff)`,
                        // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
                    },
                    "level": "district"
                }
            }
        ],
        "options": {
            "bigNumber": {
                "title": "Percentage Of Teacher Present",
                "valueSuffix": '%',
                "property": 'teaching_present'
            }
        }
    },
    outside_bignumber2: {
        "label": "Average Non Teaching Staff Present",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "bigNumber": 
                    `select ROUND((sum_attendance * 100.0 / count_attendance),2) AS nonteaching_present
                    FROM teacher_attendance.non_teach_dash ntd  WHERE 
                        date = (SELECT MAX(date) FROM teacher_attendance.non_teach_dash ntd2); `,
                    // `SELECT
                    // ROUND(sum(ts.attendance_status) * 100 / count(ts.attendance_status),2) AS nonteaching_present
                    // FROM teacher_attendance.nonteaching_staff ts
                    // WHERE date = (SELECT MAX(date) FROM teacher_attendance.nonteaching_staff)`,
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
                },
                "actions": {
                    "queries": {
                        "bigNumber": 
                        `select ROUND((sum_attendance * 100.0 / count_attendance),2) AS nonteaching_present
                        FROM teacher_attendance.non_teach_dash ntd  WHERE 
                            date = (SELECT MAX(date) FROM teacher_attendance.non_teach_dash ntd2); `,
                                                // `SELECT
                        // ROUND(sum(ts.attendance_status) * 100 / count(ts.attendance_status),2) AS nonteaching_present
                        // FROM teacher_attendance.nonteaching_staff ts
                        // WHERE date = (SELECT MAX(date) FROM teacher_attendance.nonteaching_staff)`,
                        // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
                    },
                    "level": "district"
                }
            }
        ],
        "options": {
            "bigNumber": {
                "title": "Percentage of Non Teaching Staff Present",
                "valueSuffix": '%',
                "property": 'nonteaching_present'
            }
        }
    },
    // outside_bignumber3: {
    //     "label": "Average Non Teaching Staff Present",
    //     "filters": [
    //         {
    //             "name": "State",
    //             "labelProp": "state_name",
    //             "valueProp": "state_id",
    //             "hierarchyLevel": "1",
    //             "timeSeriesQueries": {
    //                 "bigNumber": `select
    //                 max
    //                 (
    //                 date as date
    //                 )
    //                 from
    //                 teacher_attendance.teaching_staff ts `,
    //                 // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
    //             },
    //             "actions": {
    //                 "queries": {
    //                     "bigNumber": `select
    //                     max
    //                     (
    //                     date as v
    //                     )
    //                     from
    //                     teacher_attendance.teaching_staff ts `,
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

    teacher_barchart:{
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
                    
                    d.district_name as level,
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate
                GROUP BY
                     d.district_name;
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`SELECT 
                        
                        d.district_name as level,
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate
                    GROUP BY
                         d.district_name;
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
                   
                    b.block_name as level,
                   
                    
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND b.district_id = {district_id}
                GROUP BY
                    
                    b.block_name `,
                },
                "actions": {
                    "queries": {
                        "barChart":
                        `SELECT
                       
                        b.block_name as level,
                       
                        
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND b.district_id = {district_id}
                    GROUP BY
                        
                        b.block_name `,
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
                    
                    c.cluster_name as level,
                    
                    
                    
                    
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND c.block_id = {block_id}
                GROUP BY
                    
                    c.cluster_name
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`SELECT
                        
                        c.cluster_name as level,
                        
                        
                        
                        
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    JOIN
                        dimensions.block b ON c.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND c.block_id = {block_id}
                    GROUP BY
                        
                        c.cluster_name
                        `
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
                  
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.teaching_staff ts
                JOIN
                    dimensions.school sch ON sch.school_id = ts.school_id
                JOIN
                    dimensions.cluster c ON sch.cluster_id = c.cluster_id
                JOIN
                    dimensions.block b ON c.block_id = b.block_id
                JOIN
                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                GROUP BY
                   ts.school_id,
                    sch.school_name,
                    sch.cluster_id,
                    
                    c.block_id,
                    b.district_id;`,
                },
                "actions": {
                    "queries": {
                        "barChart":`SELECT
                        ts.school_id,
                        sch.school_name as level,
                        sch.cluster_id,
                        
                        c.block_id,
                        
                        b.district_id,
                      
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.teaching_staff ts
                    JOIN
                        dimensions.school sch ON sch.school_id = ts.school_id
                    JOIN
                        dimensions.cluster c ON sch.cluster_id = c.cluster_id
                    JOIN
                        dimensions.block b ON c.block_id = b.block_id
                    JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    WHERE
                    ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                    GROUP BY
                       ts.school_id,
                        sch.school_name,
                        sch.cluster_id,
                        
                        c.block_id,
                        b.district_id;`
                    },
                    "level": "school"
                }
            },

        ],
        "options": {
            "barChart": {
                "metricLabelProp": "Percentage",
                "metricValueProp": "perc_teachers",
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
                        "valuePrefix": "School Name: ",
                        "value": "school_name",
                        "valueSuffix": ""
                    },
                    {
                        "valuePrefix": "Average Percentage Teacher: ",
                        "value": "perc_teachers",
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
    teacher_trendchart:{
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
                    TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(ts.attendance_status),0) as staff_present
                    from
                    teacher_attendance.teaching_staff ts  
                    left join
                    dimensions.district d on ts.district_id  = d.district_id 
                    where 
                    ts.date between startDate and endDate 
                    group by 
                    TO_CHAR(ts.date, 'YYYY-MM-DD') 
                    ORDER BY
                    TO_CHAR(ts.date, 'YYYY-MM-DD') 
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`select 
                        TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                        coalesce(sum(ts.attendance_status),0) as staff_present
                        from
                        teacher_attendance.teaching_staff ts  
                        left join
                        dimensions.district d on ts.district_id  = d.district_id 
                        where 
                        ts.date between startDate and endDate 
                        group by 
                        TO_CHAR(ts.date, 'YYYY-MM-DD') 
                        ORDER BY
                        TO_CHAR(ts.date, 'YYYY-MM-DD') 
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
                    ts.district_id ,
                    d.district_name,
                    ts.block_id ,
                    b.block_name,
                    TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(ts.attendance_status),0) as staff_present
                    from
                    teacher_attendance.teaching_staff ts 
                    left join 
                    dimensions.district d on ts.district_id = d.district_id 
                    left join 
                    dimensions.block b on ts.block_id = b.block_id 
                    where 
                    ts.date between startDate and endDate and  ts.district_id = {district_id}
                    group by 
                    TO_CHAR(ts.date, 'YYYY-MM-DD')  ,ts.district_id ,ts.block_id ,
                    b.block_name,
                    d.district_name
                    ORDER BY
                    TO_CHAR(ts.date, 'YYYY-MM-DD') `,
                },
                "actions": {
                    "queries": {
                        "barChart":
                        `select
                        ts.district_id ,
                        d.district_name,
                        ts.block_id ,
                        b.block_name,
                        TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                        coalesce(sum(ts.attendance_status),0) as staff_present
                        from
                        teacher_attendance.teaching_staff ts 
                        left join 
                        dimensions.district d on ts.district_id = d.district_id 
                        left join 
                        dimensions.block b on ts.block_id = b.block_id 
                        where 
                        ts.date between startDate and endDate and  ts.district_id = {district_id}
                        group by 
                        TO_CHAR(ts.date, 'YYYY-MM-DD')  ,ts.district_id ,ts.block_id ,
                        b.block_name,
                        d.district_name
                        ORDER BY
                        TO_CHAR(ts.date, 'YYYY-MM-DD')`,
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
                    ts.district_id ,
                    d.district_name,
                    ts.block_id ,
                    b.block_name,
                    ts.cluster_id,
                    c.cluster_name,
                    TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(ts.attendance_status),0) as staff_present
                    from
                    teacher_attendance.teaching_staff ts 
                    left join 
                    dimensions.district d on ts.district_id = d.district_id 
                    left join 
                    dimensions.block b on ts.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on ts.cluster_id  = c.cluster_id  
                    where 
                    ts.date between startDate and endDate and ts.block_id = {block_id}
                    group by 
                    TO_CHAR(ts.date, 'YYYY-MM-DD') ,ts.district_id ,ts.block_id ,
                    b.block_name,ts.cluster_id ,c.cluster_name,
                    d.district_name
                    ORDER BY
                    TO_CHAR(ts.date, 'YYYY-MM-DD') 
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`select
                        ts.district_id ,
                        d.district_name,
                        ts.block_id ,
                        b.block_name,
                        ts.cluster_id,
                        c.cluster_name,
                        TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                        coalesce(sum(ts.attendance_status),0) as staff_present
                        from
                        teacher_attendance.teaching_staff ts 
                        left join 
                        dimensions.district d on ts.district_id = d.district_id 
                        left join 
                        dimensions.block b on ts.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on ts.cluster_id  = c.cluster_id  
                        where 
                        ts.date between startDate and endDate and ts.block_id = {block_id}
                        group by 
                        TO_CHAR(ts.date, 'YYYY-MM-DD') ,ts.district_id ,ts.block_id ,
                        b.block_name,ts.cluster_id ,c.cluster_name,
                        d.district_name
                        ORDER BY
                        TO_CHAR(ts.date, 'YYYY-MM-DD') 
                        `
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
                    ts.district_id ,
                    d.district_name,
                    ts.block_id ,
                    b.block_name,
                    ts.cluster_id,
                    c.cluster_name,
                    ts.school_id ,
                    sch.school_name,
                    TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(ts.attendance_status),0) as staff_present
                    from
                    teacher_attendance.teaching_staff ts 
                    left join 
                    dimensions.district d on ts.district_id = d.district_id 
                    left join 
                    dimensions.block b on ts.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on ts.cluster_id  = c.cluster_id  
                    left join 
                    dimensions.school sch on ts.school_id = sch.school_id 
                    where 
                    ts.date between startDate and endDate and ts.cluster_id = {cluster_id}
                    group by 
                    TO_CHAR(ts.date, 'YYYY-MM-DD') ,ts.district_id ,ts.block_id ,
                    b.block_name,ts.cluster_id ,c.cluster_name,
                    d.district_name,ts.school_id ,
                    sch.school_name
                    ORDER BY
                    TO_CHAR(ts.date, 'YYYY-MM-DD') 
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`select
                        ts.district_id ,
                        d.district_name,
                        ts.block_id ,
                        b.block_name,
                        ts.cluster_id,
                        c.cluster_name,
                        ts.school_id ,
                        sch.school_name,
                        TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                        coalesce(sum(ts.attendance_status),0) as staff_present
                        from
                        teacher_attendance.teaching_staff ts 
                        left join 
                        dimensions.district d on ts.district_id = d.district_id 
                        left join 
                        dimensions.block b on ts.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on ts.cluster_id  = c.cluster_id  
                        left join 
                        dimensions.school sch on ts.school_id = sch.school_id 
                        where 
                        ts.date between startDate and endDate and ts.cluster_id = {cluster_id}
                        group by 
                        TO_CHAR(ts.date, 'YYYY-MM-DD') ,ts.district_id ,ts.block_id ,
                        b.block_name,ts.cluster_id ,c.cluster_name,
                        d.district_name,ts.school_id ,
                        sch.school_name
                        ORDER BY
                        TO_CHAR(ts.date, 'YYYY-MM-DD') 
                        `
                    },
                    "level": "school"
                }
            },

        ],
        "options": {
            "barChart": {
                "metricLabelProp": "Staff Present",
                "metricValueProp": "staff_present",
                "yAxis": {
                    "title": "Staff Present"
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
                        "valuePrefix": "School Name: ",
                        "value": "school_name",
                        "valueSuffix": ""
                    },
                    {
                        "valuePrefix": "Average Percentage Teacher: ",
                        "value": "perc_teachers",
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
   
    staff_barchart:{
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
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
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
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
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
                   
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.district_id = {district_id}
                GROUP BY
                    ts.block_id,
                    b.block_name;`,
                },
                "actions": {
                    "queries": {
                        "barChart":
                        `SELECT
                        ts.block_id,
                        b.block_name as level,
                       
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND ts.district_id = {district_id}
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
                    "barChart": `SELECT
                    ts.cluster_id,
                    c.cluster_name as level,
                    
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name
                    ;
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`SELECT
                        ts.cluster_id,
                        c.cluster_name as level,
                        
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                    GROUP BY
                        ts.cluster_id,
                        c.cluster_name
                        ;
                        `
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
                    
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                GROUP BY
                   ts.school_id,
                    sch.school_name;
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`SELECT
                        ts.school_id,
                        sch.school_name as level,
                        
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                    LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                    GROUP BY
                       ts.school_id,
                        sch.school_name;
                        `
                    },
                    "level": "school"
                }
            },

        ],
        "options": {
            "barChart": {
                "metricLabelProp": "Percentage",
                "metricValueProp": "perc_teachers",
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
                        "valuePrefix": "School Name: ",
                        "value": "school_name",
                        "valueSuffix": ""
                    },
                    {
                        "valuePrefix": "Average Percentage Teacher: ",
                        "value": "perc_teachers",
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
    staff_trendchart:{
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
                    TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(ts.attendance_status),0) as non_staff_present
                    from
                    teacher_attendance.nonteaching_staff ts  
                    left join
                    dimensions.district d on ts.district_id  = d.district_id 
                    where 
                    ts.date between startDate and endDate 
                    group by 
                    TO_CHAR(ts.date, 'YYYY-MM-DD')
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`select 
                        TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                        coalesce(sum(ts.attendance_status),0) as non_staff_present
                        from
                        teacher_attendance.nonteaching_staff ts  
                        left join
                        dimensions.district d on ts.district_id  = d.district_id 
                        where 
                        ts.date between startDate and endDate 
                        group by 
                        TO_CHAR(ts.date, 'YYYY-MM-DD')
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
                    ts.district_id ,
                    d.district_name,
                    ts.block_id ,
                    b.block_name,
                    TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(ts.attendance_status),0) as non_staff_present
                    from
                    teacher_attendance.nonteaching_staff ts 
                    left join 
                    dimensions.district d on ts.district_id = d.district_id 
                    left join 
                    dimensions.block b on ts.block_id = b.block_id 
                    where 
                    ts.date between startDate and endDate and  ts.district_id = {district_id}
                    group by 
                    TO_CHAR(ts.date, 'YYYY-MM-DD')  ,ts.district_id ,ts.block_id ,
                    b.block_name,
                    d.district_name`,
                },
                "actions": {
                    "queries": {
                        "barChart":
                        `select
                        ts.district_id ,
                        d.district_name,
                        ts.block_id ,
                        b.block_name,
                        TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                        coalesce(sum(ts.attendance_status),0) as non_staff_present
                        from
                        teacher_attendance.nonteaching_staff ts 
                        left join 
                        dimensions.district d on ts.district_id = d.district_id 
                        left join 
                        dimensions.block b on ts.block_id = b.block_id 
                        where 
                        ts.date between startDate and endDate and  ts.district_id = {district_id}
                        group by 
                        TO_CHAR(ts.date, 'YYYY-MM-DD')  ,ts.district_id ,ts.block_id ,
                        b.block_name,
                        d.district_name`,
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
                    ts.district_id ,
                    d.district_name,
                    ts.block_id ,
                    b.block_name,
                    ts.cluster_id,
                    c.cluster_name,
                    TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(ts.attendance_status),0) as non_staff_present
                    from
                    teacher_attendance.nonteaching_staff ts 
                    left join 
                    dimensions.district d on ts.district_id = d.district_id 
                    left join 
                    dimensions.block b on ts.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on ts.cluster_id  = c.cluster_id  
                    where 
                    ts.date between startDate and endDate and ts.block_id = {block_id}
                    group by 
                    TO_CHAR(ts.date, 'YYYY-MM-DD')  ,ts.district_id ,ts.block_id ,
                    b.block_name,ts.cluster_id ,c.cluster_name,
                    d.district_name
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`select
                        ts.district_id ,
                        d.district_name,
                        ts.block_id ,
                        b.block_name,
                        ts.cluster_id,
                        c.cluster_name,
                        TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                        coalesce(sum(ts.attendance_status),0) as non_staff_present
                        from
                        teacher_attendance.nonteaching_staff ts 
                        left join 
                        dimensions.district d on ts.district_id = d.district_id 
                        left join 
                        dimensions.block b on ts.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on ts.cluster_id  = c.cluster_id  
                        where 
                        ts.date between startDate and endDate and ts.block_id = {block_id}
                        group by 
                        TO_CHAR(ts.date, 'YYYY-MM-DD')  ,ts.district_id ,ts.block_id ,
                        b.block_name,ts.cluster_id ,c.cluster_name,
                        d.district_name
                        `
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
                    ts.district_id ,
                    d.district_name,
                    ts.block_id ,
                    b.block_name,
                    ts.cluster_id,
                    c.cluster_name,
                    ts.school_id ,
                    sch.school_name,
                    TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                    coalesce(sum(ts.attendance_status),0) as non_staff_present
                    from
                    teacher_attendance.nonteaching_staff ts 
                    left join 
                    dimensions.district d on ts.district_id = d.district_id 
                    left join 
                    dimensions.block b on ts.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on ts.cluster_id  = c.cluster_id  
                    left join 
                    dimensions.school sch on ts.school_id = sch.school_id 
                    where 
                    ts.date between startDate and endDate and ts.cluster_id = {cluster_id}
                    group by 
                    TO_CHAR(ts.date, 'YYYY-MM-DD') ,ts.district_id ,ts.block_id ,
                    b.block_name,ts.cluster_id ,c.cluster_name,
                    d.district_name,ts.school_id ,
                    sch.school_name
                    
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`select
                        ts.district_id ,
                        d.district_name,
                        ts.block_id ,
                        b.block_name,
                        ts.cluster_id,
                        c.cluster_name,
                        ts.school_id ,
                        sch.school_name,
                        TO_CHAR(ts.date, 'YYYY-MM-DD') AS level,
                        coalesce(sum(ts.attendance_status),0) as non_staff_present
                        from
                        teacher_attendance.nonteaching_staff ts 
                        left join 
                        dimensions.district d on ts.district_id = d.district_id 
                        left join 
                        dimensions.block b on ts.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on ts.cluster_id  = c.cluster_id  
                        left join 
                        dimensions.school sch on ts.school_id = sch.school_id 
                        where 
                        ts.date between startDate and endDate and ts.cluster_id = {cluster_id}
                        group by 
                        TO_CHAR(ts.date, 'YYYY-MM-DD') ,ts.district_id ,ts.block_id ,
                        b.block_name,ts.cluster_id ,c.cluster_name,
                        d.district_name,ts.school_id ,
                        sch.school_name
                        
                        `
                    },
                    "level": "school"
                }
            },

        ],
        "options": {
            "barChart": {
                "metricLabelProp": "Non Staff Present",
                "metricValueProp": "non_staff_present",
                "yAxis": {
                    "title": "Non Staff Present"
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
                        "valuePrefix": "School Name: ",
                        "value": "school_name",
                        "valueSuffix": ""
                    },
                    {
                        "valuePrefix": "Average Percentage Teacher: ",
                        "value": "perc_teachers",
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
    staff_average_table: {
        "label": "Average Score",
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
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
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
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate
                    GROUP BY
                        ts.district_id, d.district_name;`                       ,
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
                   
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.district_id = {district_id}
                GROUP BY
                    ts.block_id,
                    b.block_name; `,
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        ts.block_id,
                        b.block_name,
                       
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND ts.district_id = {district_id}
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
                    
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name
                    ;
                    ;`,
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        ts.cluster_id,
                        c.cluster_name,
                        
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                    GROUP BY
                        ts.cluster_id,
                        c.cluster_name
                        ;
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
                    
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                GROUP BY
                   ts.school_id,
                    sch.school_name;`
                },
                "actions": {
                    "queries": {
                        "table": `SELECT
                        ts.school_id,
                        sch.school_name,
                        
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                    LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND sch.cluster_id = {cluster_id}
                    GROUP BY
                       ts.school_id,
                        sch.school_name;
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
                                linkedReports: ["staff_bignumber", "staff_average_school","staff_barchart","staff_trendchart"]
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
                                linkedReports: ["staff_bignumber", "staff_average_school","staff_barchart","staff_trendchart"]
                            },
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
                                linkedReports: ["staff_bignumber", "staff_average_school","staff_barchart","staff_trendchart"]
                            },
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
                                linkedReports: ["staff_bignumber", "staff_average_school","staff_barchart","staff_trendchart"]
                            },
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
                        name: "% Present Non Teaching Staff ",
                        property: "perc_teachers",
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
    staff_bignumber: {
        "label": "Average Score",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "bigNumber": `SELECT 
                    ROUND(AVG(perc_teachers)) AS perc_teachers
                    from (SELECT 
                    ts.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate
                GROUP BY
                    ts.district_id, d.district_name) AS avg_query;`

                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_teachers)) AS perc_teachers
                        from (SELECT 
                        ts.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                        LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
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
                    ROUND(AVG(perc_teachers)) AS perc_teachers
                    from (SELECT 
                    ts.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.district_id ={district_id}
                GROUP BY
                    ts.district_id, d.district_name) AS avg_query;`
                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_teachers)) AS perc_teachers
                        from (SELECT 
                        ts.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                        LEFT JOIN                        dimensions.district d ON ts.district_id = d.district_id
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
                    ROUND(AVG(perc_teachers)) AS perc_teachers
                    from (SELECT
                    ts.block_id,
                    b.block_name,
                    b.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                GROUP BY
                    ts.block_id,
                    b.block_name,b.district_id, d.district_name) AS avg_query;`,
                    
                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_teachers)) AS perc_teachers
                        from (SELECT
                        ts.block_id,
                        b.block_name,
                        b.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                        LEFT JOIN                        dimensions.block b ON ts.block_id = b.block_id
                        LEFT JOIN
                        dimensions.district d ON b.district_id = d.district_id
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
                    ROUND(AVG(perc_teachers)) AS perc_teachers
                    from (SELECT
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    b.block_name,
                    b.district_id,
                    d.district_name,
                    SUM(ts.attendance_status) AS present_teachers,
                    COUNT(ts.attendance_status) AS total_teachers,
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                FROM
                    teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                    dimensions.block b ON c.block_id = b.block_id
                    LEFT JOIN
                    dimensions.district d ON b.district_id = d.district_id
                WHERE
                    ts.date BETWEEN startDate AND endDate AND ts.cluster_id = {cluster_id}
                GROUP BY
                    ts.cluster_id,
                    c.cluster_name,
                    c.block_id,
                    b.block_name,b.district_id, d.district_name) AS avg_query;
                
                
                `,
                   
                },
                "actions": {
                    "queries": {
                        "bigNumber": `SELECT 
                        ROUND(AVG(perc_teachers)) AS perc_teachers
                        from (SELECT
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        b.block_name,
                        b.district_id,
                        d.district_name,
                        SUM(ts.attendance_status) AS present_teachers,
                        COUNT(ts.attendance_status) AS total_teachers,
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    FROM
                        teacher_attendance.nonteaching_staff ts
                        LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        LEFT JOIN
                        dimensions.block b ON c.block_id = b.block_id
                        LEFT JOIN
                        dimensions.district d ON b.district_id = d.district_id
                    WHERE
                        ts.date BETWEEN startDate AND endDate AND ts.cluster_id = {cluster_id}
                    GROUP BY
                        ts.cluster_id,
                        c.cluster_name,
                        c.block_id,
                        b.block_name,b.district_id, d.district_name) AS avg_query;
                    
                    
                    `,
                        
                    },
                    "level": "school"
                }
            }
        ],
        "options": {
            "bigNumber": {
                "title": "Average Non Teaching Staff Present",
                "valueSuffix": '%',
                "property": 'perc_teachers'
            }
        }
    },
    staff_average_school: {
        "label": "Average Teachers Present",
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "table": `select
                    ts.district_id,d.district_name,
                    ts.school_id,sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    from
                    teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       teacher_attendance.nonteaching_staff ts
                       where ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date BETWEEN startDate AND endDate
                    GROUP BY
                    ts.district_id,d.district_name,
                    ts.school_id,sch.school_name,days_count.total_days`
                },
                "actions": {
                    "queries": {
                        "table": `select
                        ts.district_id,d.district_name,
                        ts.school_id,sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                        from
                        teacher_attendance.nonteaching_staff ts
                        LEFT JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           teacher_attendance.nonteaching_staff ts
                           where ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where ts.date BETWEEN startDate AND endDate
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
                    ts.district_id,d.district_name,
                    ts.school_id,sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    from
                    teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       teacher_attendance.nonteaching_staff ts
                       where ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date BETWEEN startDate AND endDate AND ts.district_id = {district_id}
                    GROUP BY
                    ts.district_id,d.district_name,
                    ts.school_id,sch.school_name,days_count.total_days
                    order by total_teachers;
                                       `
                },
                "actions": {
                    "queries": {
                        "table": `select
                        ts.district_id,d.district_name,
                        ts.school_id,sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                        from
                        teacher_attendance.nonteaching_staff ts
                        LEFT JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           teacher_attendance.nonteaching_staff ts
                           where ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where ts.date BETWEEN startDate AND endDate AND ts.district_id = {district_id}
                        GROUP BY
                        ts.district_id,d.district_name,
                        ts.school_id,sch.school_name,days_count.total_days
                        order by total_teachers;
                        
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
                    ts.district_id,d.district_name,
                    ts.block_id,b.block_name,
                    ts.school_id,sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    from
                    teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       teacher_attendance.nonteaching_staff ts
                       where ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                    GROUP BY
                    ts.district_id,d.district_name,
                    ts.block_id,b.block_name,
                    ts.school_id,sch.school_name,days_count.total_days
                    `
                },
                "actions": {
                    "queries": {
                        "table": `select
                        ts.district_id,d.district_name,
                        ts.block_id,b.block_name,
                        ts.school_id,sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                        from
                        teacher_attendance.nonteaching_staff ts
                        LEFT JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           teacher_attendance.nonteaching_staff ts
                           where ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where ts.date BETWEEN startDate AND endDate AND ts.block_id = {block_id}
                        GROUP BY
                        ts.district_id,d.district_name,
                        ts.block_id,b.block_name,
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
                    ts.district_id,d.district_name,
                    ts.block_id,b.block_name,
                    ts.cluster_id, c.cluster_name,
                    ts.school_id,sch.school_name,
                    (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                    (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                    ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                    from
                    teacher_attendance.nonteaching_staff ts
                    LEFT JOIN
                    dimensions.school sch ON ts.school_id = sch.school_id
                    LEFT JOIN
                    dimensions.cluster c ON ts.cluster_id = c.cluster_id
                    LEFT JOIN
                    dimensions.block b ON ts.block_id = b.block_id
                    LEFT JOIN
                    dimensions.district d ON ts.district_id = d.district_id
                    JOIN
                     (
                      select ts.school_id,
                      COUNT(DISTINCT ts.date) AS total_days
                      FROM
                       teacher_attendance.nonteaching_staff ts
                       where ts.date BETWEEN startDate AND endDate
                       GROUP BY
                       ts.school_id
                        ) AS days_count ON ts.school_id = days_count.school_id
                    Where ts.date BETWEEN startDate AND endDate AND ts.cluster_id = {cluster_id}
                    GROUP BY
                    ts.district_id,d.district_name,
                    ts.block_id,b.block_name,
                    ts.cluster_id, c.cluster_name,
                    ts.school_id,sch.school_name,days_count.total_days
                    
                    
                    `
                },
                "actions": {
                    "queries": {
                        "table": `select
                        ts.district_id,d.district_name,
                        ts.block_id,b.block_name,
                        ts.cluster_id, c.cluster_name,
                        ts.school_id,sch.school_name,
                        (SUM(ts.attendance_status)/days_count.total_days) as present_teachers,
                        (COUNT(ts.attendance_status)/ days_count.total_days) AS total_teachers,          
                        ROUND(SUM(ts.attendance_status) * 100.0 / COUNT(ts.attendance_status), 2) AS perc_teachers
                        from
                        teacher_attendance.nonteaching_staff ts
                        LEFT JOIN
                        dimensions.school sch ON ts.school_id = sch.school_id
                        LEFT JOIN
                        dimensions.cluster c ON ts.cluster_id = c.cluster_id
                        LEFT JOIN
                        dimensions.block b ON ts.block_id = b.block_id
                        LEFT JOIN
                        dimensions.district d ON ts.district_id = d.district_id
                        JOIN
                         (
                          select ts.school_id,
                          COUNT(DISTINCT ts.date) AS total_days
                          FROM
                           teacher_attendance.nonteaching_staff ts
                           where ts.date BETWEEN startDate AND endDate
                           GROUP BY
                           ts.school_id
                            ) AS days_count ON ts.school_id = days_count.school_id
                        Where ts.date BETWEEN startDate AND endDate AND ts.cluster_id = {cluster_id}
                        GROUP BY
                        ts.district_id,d.district_name,
                        ts.block_id,b.block_name,
                        ts.cluster_id, c.cluster_name,
                        ts.school_id,sch.school_name,days_count.total_days
                        
                        
                        `,
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
                        name: "Total Non Teaching Staff",
                        property: "total_teachers",
                        class: "text-center"
                    },
                    {
                        name: "Total Non Teaching Staff Present",
                        property: "present_teachers",
                        class: "text-center"
                    },
                    
                    {
                        name: "% Present Non Teaching Staff",
                        property: "perc_teachers",
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

}

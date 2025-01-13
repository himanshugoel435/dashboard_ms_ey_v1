
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
       
       
        // {
		// 	label: 'Tele Education',

        //     // displayLabel:'Class',

		// 	name: 'project',

		// 	labelProp: 'project_name',

		// 	valueProp: 'project_name',

		// 	id: 'project',

		// 	tableAlias: 'pdd',

		// 	query:
		// 		'SELECT project_name FROM dimensions.project_dimension_data ORDER BY project_name ASC ',
		// },
       
        
       
        
        
        {
			label: 'Session',

			name: 'class',

			labelProp: 'tele_class_name',

			valueProp: 'tele_class_id',

			id: 'class',

			tableAlias: 'tcdd',

			query:
				'SELECT  tele_class_id, tele_class_name FROM dimensions.tele_class_dimension_data ORDER BY CAST(tele_class_id AS INT) ASC ',
		},
        {
			label: 'Session',

			name: 'medium',

			labelProp: 'tele_medium_name',

			valueProp: 'tele_medium_name',

			id: 'medium',

			tableAlias: 'tmdd',

			query:
				'SELECT tele_medium_name FROM dimensions.tele_medium_dimension_data ORDER BY tele_medium_name ASC ',
		}
        
	
	],
   
	

    ///right table for comparative
    tele_education_table: {
        "label": "Tele Education",
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "table": `select 
                    te.district_id,
                    d.district_name,
                    sum(te.status) as connected,
                    count(te.status)-sum(te.status) as not_connected,
                    ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total,
                    ROUND(cast(sum(te.status) as decimal (10,2)) * 100 / (sum(te.status) + (count(te.status)-sum(te.status))),2) as perc_connected                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    where 
                    te.date between startDate and endDate  
                    group by
                    te.district_id,
                    d.district_name `,
                },
                "actions": {
                    "queries": {
                        "table": `select 
                        te.district_id,
                        d.district_name,
                        sum(te.status) as connected,
                        count(te.status)-sum(te.status) as not_connected,
                        ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total,
                        ROUND(cast(sum(te.status) as decimal (10,2)) * 100 / (sum(te.status) + (count(te.status)-sum(te.status))),2) as perc_connected                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        where 
                        te.date between startDate and endDate  
                        group by
                        te.district_id,
                        d.district_name `,
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

                    te.block_id ,
                    b.block_name,
                    sum(te.status) as connected,
                    count(te.status)-sum(te.status) as not_connected,
                    ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total,
                    ROUND(cast(sum(te.status) as decimal (10,2)) * 100 / (sum(te.status) + (count(te.status)-sum(te.status))),2) as perc_connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    where 
                    te.date between startDate and endDate   and te.district_id = {district_id}
                    group by
                    
                    te.block_id ,
                    b.block_name `,
                },
                "actions": {
                    "queries": {
                        "table": `select 

                        te.block_id ,
                        b.block_name,
                        sum(te.status) as connected,
                        count(te.status)-sum(te.status) as not_connected,
                        ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total,
                        ROUND(cast(sum(te.status) as decimal (10,2)) * 100 / (sum(te.status) + (count(te.status)-sum(te.status))),2) as perc_connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        where 
                        te.date between startDate and endDate   and te.district_id = {district_id}
                        group by
                        
                        te.block_id ,
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
                    "table": `select 

                    te.cluster_id ,
                    c.cluster_name,
                    sum(te.status) as connected,
                    count(te.status)-sum(te.status) as not_connected,
                    ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total,
                    ROUND(cast(sum(te.status) as decimal (10,2)) * 100 / (sum(te.status) + (count(te.status)-sum(te.status))),2) as perc_connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on te.cluster_id = c.cluster_id 
                    where 
                    te.date between startDate and endDate   and te.block_id  = {block_id}
                    group by
                    
                    te.cluster_id ,
                    c.cluster_name  `,
                },
                "actions": {
                    "queries": {
                        "table": `select 

                        te.cluster_id ,
                        c.cluster_name,
                        sum(te.status) as connected,
                        count(te.status)-sum(te.status) as not_connected,
                        ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total,
                        ROUND(cast(sum(te.status) as decimal (10,2)) * 100 / (sum(te.status) + (count(te.status)-sum(te.status))),2) as perc_connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on te.cluster_id = c.cluster_id 
                        where 
                        te.date between startDate and endDate   and te.block_id  = {block_id}
                        group by
                        
                        te.cluster_id ,
                        c.cluster_name  `,
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

                    te.school_id ,
                    sch.school_name,
                    sum(te.status) as connected,
                    count(te.status)-sum(te.status) as not_connected,
                    ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total,
                    ROUND(cast(sum(te.status) as decimal (10,2)) * 100 / (sum(te.status) + (count(te.status)-sum(te.status))),2) as perc_connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on te.cluster_id = c.cluster_id 
                    left join 
                    dimensions.school sch on te.school_id = sch.school_id 
                    where 
                    te.date between startDate and endDate   and te.cluster_id  = {cluster_id}
                    group by
                    
                    te.school_id ,
                    sch.school_name
                     
                
                    `
                },
                "actions": {
                    "queries": {
                        "table": `select 

                        te.school_id ,
                        sch.school_name,
                        sum(te.status) as connected,
                        count(te.status)-sum(te.status) as not_connected,
                        ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total,
                        ROUND(cast(sum(te.status) as decimal (10,2)) * 100 / (sum(te.status) + (count(te.status)-sum(te.status))),2) as perc_connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on te.cluster_id = c.cluster_id 
                        left join 
                        dimensions.school sch on te.school_id = sch.school_id 
                        where 
                        te.date between startDate and endDate   and te.cluster_id  = {cluster_id}
                        group by
                        
                        te.school_id ,
                        sch.school_name
                        
                    
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
                                linkedReports: ["tele_complete_bignumber", "tele_noncomplete_bignumber"]    },

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
                                linkedReports: ["tele_complete_bignumber", "tele_noncomplete_bignumber"]    },

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
                                linkedReports: ["tele_complete_bignumber", "tele_noncomplete_bignumber"]    },
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
                                linkedReports: ["tele_complete_bignumber", "tele_noncomplete_bignumber"]    },

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
                        name: "Connected",
                        property: "connected",
                        class: "text-center"
                    },
                    {
                        name: "Not Connected",
                        property: "not_connected",
                        class: "text-center"
                    },
                    {
                        name: "Total",
                        property: "total",
                        class: "text-center"
                    },
                    
                    {
                        name: "Percentage of Connected",
                        property: "perc_connected",
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
tele_complete_bignumber: {
        "label": "Tele Education",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "bigNumber": `select sum(connected) as connected
                    from (select 
                    te.district_id,
                    d.district_name,
                    sum(te.status) as connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    where 
                    te.date between startDate and endDate  
                    group by
                    te.district_id,
                    d.district_name ) as sum_query
                    `

                },
                "actions": {
                    "queries": {
                        "bigNumber": `select sum(connected) as connected
                        from (select 
                        te.district_id,
                        d.district_name,
                        sum(te.status) as connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        where 
                        te.date between startDate and endDate  
                        group by
                        te.district_id,
                        d.district_name ) as sum_query
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
                    "bigNumber": `select sum(connected) as connected
                    from (select 
                    te.district_id,
                    d.district_name,
                    te.block_id ,
                    b.block_name,
                    sum(te.status) as connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    where 
                    te.date between startDate and endDate   and te.district_id = {district_id}
                    group by
                    te.district_id,
                    d.district_name ,
                    te.block_id ,
                    b.block_name ) as sum_query
                        `
                },
                "actions": {
                    "queries": {
                        "bigNumber": `select sum(connected) as connected
                        from (select 
                        te.district_id,
                        d.district_name,
                        te.block_id ,
                        b.block_name,
                        sum(te.status) as connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        where 
                        te.date between startDate and endDate   and te.district_id = {district_id}
                        group by
                        te.district_id,
                        d.district_name ,
                        te.block_id ,
                        b.block_name ) as sum_query
                            `
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
                    "bigNumber": `select sum(connected) as connected
                    from (select 
                    te.district_id,
                    d.district_name,
                    te.block_id ,
                    b.block_name,
                    te.cluster_id ,
                    c.cluster_name,
                    sum(te.status) as connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on te.cluster_id = c.cluster_id 
                    where 
                    te.date between startDate and endDate   and te.block_id  = {block_id}
                    group by
                    te.district_id,
                    d.district_name ,
                    te.block_id ,
                    b.block_name ,
                    te.cluster_id ,
                    c.cluster_name ) as sum_query
                    `,
                    
                },
                "actions": {
                    "queries": {
                        "bigNumber": `select sum(connected) as connected
                        from (select 
                        te.district_id,
                        d.district_name,
                        te.block_id ,
                        b.block_name,
                        te.cluster_id ,
                        c.cluster_name,
                        sum(te.status) as connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on te.cluster_id = c.cluster_id 
                        where 
                        te.date between startDate and endDate   and te.block_id  = {block_id}
                        group by
                        te.district_id,
                        d.district_name ,
                        te.block_id ,
                        b.block_name ,
                        te.cluster_id ,
                        c.cluster_name ) as sum_query
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
                    "bigNumber": `select sum(connected) as connected
                    from (select 
                    te.district_id,
                    d.district_name,
                    te.block_id ,
                    b.block_name,
                    te.cluster_id ,
                    c.cluster_name,
                    te.school_id ,
                    sch.school_name,
                    sum(te.status) as connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on te.cluster_id = c.cluster_id 
                    left join 
                    dimensions.school sch on te.school_id = sch.school_id 
                    where 
                    te.date between startDate and endDate   and te.cluster_id  = {cluster_id}
                    group by
                    te.district_id,
                    d.district_name ,
                    te.block_id ,
                    b.block_name ,
                    te.cluster_id ,
                    c.cluster_name ,
                    te.school_id ,
                    sch.school_name) as sum_query
                    
                    
                    
                    
                    
                    
                        `,
                   
                },
                "actions": {
                    "queries": {
                        "bigNumber": `select sum(connected) as connected
                        from (select 
                        te.district_id,
                        d.district_name,
                        te.block_id ,
                        b.block_name,
                        te.cluster_id ,
                        c.cluster_name,
                        te.school_id ,
                        sch.school_name,
                        sum(te.status) as connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on te.cluster_id = c.cluster_id 
                        left join 
                        dimensions.school sch on te.school_id = sch.school_id 
                        where 
                        te.date between startDate and endDate   and te.cluster_id  = {cluster_id}
                        group by
                        te.district_id,
                        d.district_name ,
                        te.block_id ,
                        b.block_name ,
                        te.cluster_id ,
                        c.cluster_name ,
                        te.school_id ,
                        sch.school_name) as sum_query
                        
                        
                        
                        
                        
                        
    `,
                        
                    },
                    "level": "school"
                }
            }
        ],
        "options": {
            "bigNumber": {
                "title": "connected",
                "valueSuffix": '',
                "property": 'connected'
            }
        }
    },

    //percentage change big number
    tele_noncomplete_bignumber: {
        "label": "Tele Education",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "bigNumber": `select sum(not_connected) as notconnected
                    from (select 
                    te.district_id,
                    d.district_name,
                    count(te.status)-sum(te.status) as not_connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    where 
                    te.date between startDate and endDate 
                    group by
                    te.district_id,
                    d.district_name ) as sum_query
                    `

                },
                "actions": {
                    "queries": {
                        "bigNumber": `select sum(not_connected) as notconnected
                        from (select 
                        te.district_id,
                        d.district_name,
                        count(te.status)-sum(te.status) as not_connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        where 
                        te.date between startDate and endDate 
                        group by
                        te.district_id,
                        d.district_name ) as sum_query
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
                    "bigNumber": `select sum(not_connected) as notconnected
                    from (select 
                    te.district_id,
                    d.district_name,
                    te.block_id ,
                    b.block_name,
                    count(te.status)-sum(te.status) as not_connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    where 
                    te.date between startDate and endDate  and te.district_id = {district_id}
                    group by
                    te.district_id,
                    d.district_name ,
                    te.block_id ,
                    b.block_name ) as sum_query `
                },
                "actions": {
                    "queries": {
                        "bigNumber": `select sum(not_connected) as notconnected
                        from (select 
                        te.district_id,
                        d.district_name,
                        te.block_id ,
                        b.block_name,
                        count(te.status)-sum(te.status) as not_connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        where 
                        te.date between startDate and endDate  and te.district_id = {district_id}
                        group by
                        te.district_id,
                        d.district_name ,
                        te.block_id ,
                        b.block_name ) as sum_query`
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
                    "bigNumber": `select sum(not_connected) as notconnected
                    from (select 
                    te.district_id,
                    d.district_name,
                    te.block_id ,
                    b.block_name,
                    te.cluster_id ,
                    c.cluster_name,
                    count(te.status)-sum(te.status) as not_connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on te.cluster_id = c.cluster_id 
                    where 
                    te.date between startDate and endDate  and te.block_id  = {block_id}
                    group by
                    te.district_id,
                    d.district_name ,
                    te.block_id ,
                    b.block_name ,
                    te.cluster_id ,
                    c.cluster_name ) as sum_query
                    `,
                    
                },
                "actions": {
                    "queries": {
                        "bigNumber": `select sum(not_connected) as notconnected
                        from (select 
                        te.district_id,
                        d.district_name,
                        te.block_id ,
                        b.block_name,
                        te.cluster_id ,
                        c.cluster_name,
                        count(te.status)-sum(te.status) as not_connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on te.cluster_id = c.cluster_id 
                        where 
                        te.date between startDate and endDate  and te.block_id  = {block_id}
                        group by
                        te.district_id,
                        d.district_name ,
                        te.block_id ,
                        b.block_name ,
                        te.cluster_id ,
                        c.cluster_name ) as sum_query
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
                    "bigNumber": `select sum(not_connected) as notconnected
                    from (select 
                    te.district_id,
                    d.district_name,
                    te.block_id ,
                    b.block_name,
                    te.cluster_id ,
                    c.cluster_name,
                    te.school_id ,
                    sch.school_name,
                    count(te.status)-sum(te.status) as not_connected
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on te.cluster_id = c.cluster_id 
                    left join 
                    dimensions.school sch on te.school_id = sch.school_id 
                    where 
                    te.date between startDate and endDate  and te.cluster_id  = {cluster_id}
                    group by
                    te.district_id,
                    d.district_name ,
                    te.block_id ,
                    b.block_name ,
                    te.cluster_id ,
                    c.cluster_name ,
                    te.school_id ,
                    sch.school_name) as sum_query
                    `,
                   
                },
                "actions": {
                    "queries": {
                        "bigNumber": `select sum(not_connected) as notconnected
                        from (select 
                        te.district_id,
                        d.district_name,
                        te.block_id ,
                        b.block_name,
                        te.cluster_id ,
                        c.cluster_name,
                        te.school_id ,
                        sch.school_name,
                        count(te.status)-sum(te.status) as not_connected
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on te.cluster_id = c.cluster_id 
                        left join 
                        dimensions.school sch on te.school_id = sch.school_id 
                        where 
                        te.date between startDate and endDate  and te.cluster_id  = {cluster_id}
                        group by
                        te.district_id,
                        d.district_name ,
                        te.block_id ,
                        b.block_name ,
                        te.cluster_id ,
                        c.cluster_name ,
                        te.school_id ,
                        sch.school_name) as sum_query
                        
    `,
                        
                    },
                    "level": "school"
                }
            }
        ],
        "options": {
            "bigNumber": {
                "title": "Not Connected",
                "valueSuffix": '',
                "property": 'notconnected'
            }
        }
    },

    //second tab
    session_table: {
        "label": "Tele Session",
        "defaultLevel": "state",
        "filters": [
            {
                "name": "State",
                "labelProp": "state_name",
                "valueProp": "state_id",
                "hierarchyLevel": "1",
                "timeSeriesQueries": {
                    "table": `
                    
WITH subject_counts AS (
    SELECT
        ss.subjectname,  
        COUNT(ss.subjectname) AS count_of_subject  
    FROM                         
        teleeducation.studio_sessions ss          
    LEFT JOIN                  
        dimensions.tele_medium_dimension_data tmdd ON ss.tele_medium_name = tmdd.tele_medium_name  
    LEFT JOIN                    
        dimensions.tele_class_dimension_data tcdd ON ss.tele_class_name = tcdd.tele_class_name   
    WHERE
               
        ss.date BETWEEN startDate AND endDate               
    GROUP BY                        
        ss.subjectname
)
SELECT
    subjectname,
    count_of_subject
FROM
    subject_counts
UNION ALL
SELECT
    'Grand Total' AS subjectname,
    coalesce(SUM(count_of_subject),0) AS count_of_subject
FROM
    subject_counts;
                   
                 `,
                },
                "actions": {
                    "queries": {
                        "table": `
                        
WITH subject_counts AS (
    SELECT
        ss.subjectname,  
        COUNT(ss.subjectname) AS count_of_subject  
    FROM                         
        teleeducation.studio_sessions ss          
    LEFT JOIN                  
        dimensions.tele_medium_dimension_data tmdd ON ss.tele_medium_name = tmdd.tele_medium_name  
    LEFT JOIN                    
        dimensions.tele_class_dimension_data tcdd ON ss.tele_class_name = tcdd.tele_class_name   
    WHERE
               
        ss.date BETWEEN startDate AND endDate               
    GROUP BY                        
        ss.subjectname
)
SELECT
    subjectname,
    count_of_subject
FROM
    subject_counts
UNION ALL
SELECT
    'Grand Total' AS subjectname,
    coalesce(SUM(count_of_subject),0) AS count_of_subject
FROM
    subject_counts;
                   
                     `,
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

                    te.block_id ,
                    b.block_name,
                    sum(te.status) as connected,
                    count(te.status)-sum(te.status) as not_connected,
                    ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    where 
                    te.date between startDate and endDate   and te.district_id = {district_id}
                    group by
                    
                    te.block_id ,
                    b.block_name `,
                },
                "actions": {
                    "queries": {
                        "table": `select 

                        te.block_id ,
                        b.block_name,
                        sum(te.status) as connected,
                        count(te.status)-sum(te.status) as not_connected,
                        ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        where 
                        te.date between startDate and endDate   and te.district_id = {district_id}
                        group by
                        
                        te.block_id ,
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
                    "table": `select 

                    te.cluster_id ,
                    c.cluster_name,
                    sum(te.status) as connected,
                    count(te.status)-sum(te.status) as not_connected,
                    ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on te.cluster_id = c.cluster_id 
                    where 
                    te.date between startDate and endDate   and te.block_id  = {block_id}
                    group by
                    
                    te.cluster_id ,
                    c.cluster_name  `,
                },
                "actions": {
                    "queries": {
                        "table": `select 

                        te.cluster_id ,
                        c.cluster_name,
                        sum(te.status) as connected,
                        count(te.status)-sum(te.status) as not_connected,
                        ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on te.cluster_id = c.cluster_id 
                        where 
                        te.date between startDate and endDate   and te.block_id  = {block_id}
                        group by
                        
                        te.cluster_id ,
                        c.cluster_name  `,
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

                    te.school_id ,
                    sch.school_name,
                    sum(te.status) as connected,
                    count(te.status)-sum(te.status) as not_connected,
                    ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total
                    from 
                    teleeducation.tele_education te
                    left join
                    dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                    left join
                    dimensions.district d on te.district_id = d.district_id 
                    left join 
                    dimensions.block b on te.block_id = b.block_id 
                    left join 
                    dimensions.cluster c on te.cluster_id = c.cluster_id 
                    left join 
                    dimensions.school sch on te.school_id = sch.school_id 
                    where 
                    te.date between startDate and endDate   and te.cluster_id  = {cluster_id}
                    group by
                    
                    te.school_id ,
                    sch.school_name
                     
                
                    `
                },
                "actions": {
                    "queries": {
                        "table": `select 

                        te.school_id ,
                        sch.school_name,
                        sum(te.status) as connected,
                        count(te.status)-sum(te.status) as not_connected,
                        ROUND(sum(te.status) + ((count(te.status)-sum(te.status))),0) as total
                        from 
                        teleeducation.tele_education te
                        left join
                        dimensions.project_dimension_data pdd on te.project_name = pdd.project_name 
                        left join
                        dimensions.district d on te.district_id = d.district_id 
                        left join 
                        dimensions.block b on te.block_id = b.block_id 
                        left join 
                        dimensions.cluster c on te.cluster_id = c.cluster_id 
                        left join 
                        dimensions.school sch on te.school_id = sch.school_id 
                        where 
                        te.date between startDate and endDate   and te.cluster_id  = {cluster_id}
                        group by
                        
                        te.school_id ,
                        sch.school_name
                        
                    
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
                                linkedReports: ["tele_complete_bignumber", "tele_noncomplete_bignumber"]    },

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
                                linkedReports: ["tele_complete_bignumber", "tele_noncomplete_bignumber"]    },

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
                                linkedReports: ["tele_complete_bignumber", "tele_noncomplete_bignumber"]    },
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
                                linkedReports: ["tele_complete_bignumber", "tele_noncomplete_bignumber"]    },

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
                        name: "Subject",
                        property: "subjectname",
                        class: "text-center"
                    },
                   
                    
                    
                    {
                        name: "Count",
                        property: "count_of_subject",
                        class: "text-center",
                        valueSuffix: '',
                        isHeatMapRequired: true,
                        type: "number",
                        color: {
                            type: "percentage",
                            values: [
                                {
                                    color: "#007000",
                                    breakPoint: 100
                                },
                                {
                                    color: "#FFBF00",
                                    breakPoint: 70
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


    session_barchart:{
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
                    ss.subjectname as level,  
                    COUNT(ss.subjectname) AS count_of_subject  
                    FROM                         
                    teleeducation.studio_sessions ss          
                    left join                  
                    dimensions.tele_medium_dimension_data tmdd on ss.tele_medium_name = tmdd.tele_medium_name  
                    left join                    
                    dimensions.tele_class_dimension_data tcdd  on ss.tele_class_name = tcdd.tele_class_name   
                    WHERE       
                    date BETWEEN startDate AND endDate               
                    GROUP BY                        
                    ss.subjectname  
                    `,
                },
                "actions": {
                    "queries": {
                        "barChart":`SELECT
                        ss.subjectname as level,  
                        COUNT(ss.subjectname) AS count_of_subject  
                        FROM                         
                        teleeducation.studio_sessions ss          
                        left join                  
                        dimensions.tele_medium_dimension_data tmdd on ss.tele_medium_name = tmdd.tele_medium_name  
                        left join                    
                        dimensions.tele_class_dimension_data tcdd  on ss.tele_class_name = tcdd.tele_class_name   
                        WHERE       
                        date BETWEEN startDate AND endDate               
                        GROUP BY                        
                        ss.subjectname  
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
                "metricLabelProp": "Count",
                "metricValueProp": "count_of_subject",
                "yAxis": {
                    "title": "Count"
                },
                "benchmarkConfig": {
                    "linkedReport": "tas_average_attendance_bignumber"
                },
                "xAxis": {
                    "title": "Subject",
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
    
   

//pat bignumber1

student_attendance_bignumber1: {
    "label": "Total Enrolled Students",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "bigNumber":`SELECT
                ROUND(cast(sum(te.status) as DECIMAL (10,2))* 100 / count(te.status),2) AS connected_perc
                FROM teleeducation.tele_education te
                WHERE date = (SELECT MAX(date) FROM teleeducation.tele_education)`,
                // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
            },
            "actions": {
                "queries": {
                    "bigNumber": `SELECT
                    ROUND(cast(sum(te.status) as DECIMAL (10,2))* 100 / count(te.status),2) AS connected_perc
                    FROM teleeducation.tele_education te
                    WHERE date = (SELECT MAX(date) FROM teleeducation.tele_education)`,
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
                },
                "level": "district"
            }
        }
        
    ],
    "options": {
        "bigNumber": {
            "title": "Connected",
            "valueSuffix": '%',
            "property": 'connected_perc'
        }
    }
},
student_attendance_bignumber2: {
    "label": "Total Enrolled Students",
    "filters": [
        {
            "name": "State",
            "labelProp": "state_name",
            "valueProp": "state_id",
            "hierarchyLevel": "1",
            "timeSeriesQueries": {
                "bigNumber":` 
                SELECT
                ROUND((cast(count(te.status) as DECIMAL(10,2))-sum(te.status)) * 100 / count(te.status),2) as not_connected_perc
                FROM teleeducation.tele_education te
                WHERE date = (SELECT MAX(date) FROM teleeducation.tele_education)`,
                // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
            },
            "actions": {
                "queries": {
                    "bigNumber": ` 
                    SELECT
                    ROUND((cast(count(te.status) as DECIMAL(10,2))-sum(te.status)) * 100 / count(te.status),2) as not_connected_perc
                    FROM teleeducation.tele_education te
                    WHERE date = (SELECT MAX(date) FROM teleeducation.tele_education)`,
                    // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
                },
                "level": "district"
            }
        }
        
    ],
    "options": {
        "bigNumber": {
            "title": "Not Connected",
            "valueSuffix": '%',
            "property": 'not_connected_perc'
        }
    }
},
// student_attendance_bignumber3: {
//     "label": "Total Enrolled Students",
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
//                 teleeducation.tele_education te  `,
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
//                     teleeducation.tele_education te  `,
//                     // "bigNumberComparison": "select round(avg(percentage),2) as percentage from ingestion.sac_stds_avg_atd_by_district as t left join ingestion.dimension_master as m on t.district_id = m.district_id where (date between startDate and endDate) and m.state_id={state_id}"
//                 },
//                 "level": "district"
//             }
//         }
        
//     ],
//     "options": {
//         "bigNumber": {
//             "title": "Date",
//             "valueSuffix": '',
//             "property": 'date'
//         }
//     }
// },






}
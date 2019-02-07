{
    "targets":[
        {
            "target_name": "plagiarism",
            "include_dirs" : [
            "<!(node -e \"require('nan')\")"
            ],
            "sources":["plagiarismAlgo.cc"]
        }
    ],
    
}
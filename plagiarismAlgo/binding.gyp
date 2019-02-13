{
    "targets":[
        {
            "target_name": "plagiarism",
            "include_dirs" : [
                "src",
                "<!(node -e \"require('nan')\")"
            ],
            "sources":["src/plagiarismAlgorithm.cc","src/index.cc"]
        }
    ],
    
}
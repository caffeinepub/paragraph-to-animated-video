import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

actor {
  type Project = {
    title : Text;
    text : Text;
  };

  let projects = Map.empty<Text, Project>();

  public shared ({ caller }) func saveProject(title : Text, text : Text) : async () {
    if (projects.containsKey(title)) {
      Runtime.trap("A project with this title already exists. Please choose a unique title for your new project. ");
    };
    let project : Project = {
      title;
      text;
    };
    projects.add(title, project);
  };

  public query ({ caller }) func getProject(title : Text) : async Project {
    let iter = projects.values();
    let filtered = iter.filter(func(project) { project.title == title });
    switch (filtered.next()) {
      case (null) { Runtime.trap("No project found with this title. ") };
      case (?project) { project };
    };
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    projects.values().toArray();
  };
};

interface ProgramListProps {
  programs: string[];
  loading: boolean;
}

const ProgramList: React.FC<ProgramListProps> = ({ programs, loading }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Deployed Programs:
      </h2>
      {loading ? (
        <p className="text-gray-500 italic">Loading programs...</p>
      ) : programs.length === 0 ? (
        <p className="text-gray-500 italic">No deployed programs found.</p>
      ) : (
        <ul className="list-disc ml-5">
          {programs.map((program) => (
            <li key={program} className="mb-2">
              <span className="text-gray-800 hover:text-gray-900">
                {program}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProgramList;
